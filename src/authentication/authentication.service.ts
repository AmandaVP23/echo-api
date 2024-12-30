import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthPayload } from './jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordTokenService } from 'src/reset-password-token/reset-password-token.service';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthenticationService {
    private jwtRefreshSecret: string;
    private jwtRefreshExpiration: string;
    private resetPasswordTokenExpirationMinutes: number;
    private webAppBaseUrl: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly tokenService: ResetPasswordTokenService,
        private readonly mailService: MailService,
    ) {
        this.jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        this.jwtRefreshExpiration = configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION', '7d');
        this.resetPasswordTokenExpirationMinutes = configService.get<number>('RESET_TOKEN_DURATION_MINUTES', 10);
        this.webAppBaseUrl = configService.get<string>('WEB_APP_URL');
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailOrUsername(loginDto.emailOrUsername);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.usersService.validatePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
        };
    }

    async forgotPassword(forgotPassword: ForgotPasswordDto) {
        const user = await this.usersService.findByEmailOrUsername(forgotPassword.emailOrUsername);

        if (!user) {
            return;
        }

        const token = uuidv4();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + this.resetPasswordTokenExpirationMinutes);

        await this.tokenService.createToken(user, token, expirationTime);

        const resetLink = `${this.webAppBaseUrl}/reset-password/${token}`;

        await this.mailService.sendEmail(user.email, 'Forgot your password?', 'reset-password', {
            name: user.name,
            resetLink,
        });
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const existingToken = await this.tokenService.findToken(resetPasswordDto.token);
        if (!existingToken || new Date() > existingToken.expires) {
            throw new BadRequestException('Invalid or expired token');
        }

        const hashedPassword = await this.usersService.getHashedPassword(resetPasswordDto.password);

        await this.usersService.update(existingToken.user.id, { password: hashedPassword });
        await this.tokenService.deleteToken(existingToken.token);
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
