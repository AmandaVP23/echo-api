import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthPayload } from './jwt.strategy';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
    private jwtRefreshSecret: string;
    private jwtRefreshExpiration: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        this.jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        this.jwtRefreshExpiration = configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
            '7d',
        );
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailOrUsername(
            loginDto.emailOrUsername,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.usersService.validatePassword(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
        };
    }

    async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.jwtRefreshSecret,
            });
            const user = await this.usersService.findOne(decoded.userId);
            return user;
        } catch {
            return null;
        }
    }

    async refreshTokens(refreshToken: string) {
        const user = await this.getUserByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedException();
        }

        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = await this.generateRefreshToken(user);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    private generateAccessToken(user: User) {
        const payload: JwtAuthPayload = { email: user.email, userId: user.id };

        return this.jwtService.sign(payload);
    }

    private generateRefreshToken(user: User) {
        const payload: JwtAuthPayload = { email: user.email, userId: user.id };
        return this.jwtService.sign(payload, {
            secret: this.jwtRefreshSecret,
            expiresIn: this.jwtRefreshExpiration,
        });
    }
}
