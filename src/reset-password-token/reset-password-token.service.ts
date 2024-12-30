import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ResetPasswordTokenService {
    constructor(
        @InjectRepository(PasswordResetToken)
        private readonly tokenRepository: Repository<PasswordResetToken>,
    ) {}

    async createToken(user: User, token: string, expires: Date): Promise<PasswordResetToken> {
        await this.tokenRepository.delete({ user });

        const resetToken = this.tokenRepository.create({ token, expires, user });
        return this.tokenRepository.save(resetToken);
    }

    async findToken(token: string): Promise<PasswordResetToken | null> {
        // todo - test without the relations
        return this.tokenRepository.findOne({ where: { token }, relations: ['user'] });
    }

    async deleteToken(token: string): Promise<void> {
        await this.tokenRepository.delete({ token });
    }

    async deleteTokenByUser(user: User): Promise<void> {
        await this.tokenRepository.delete({ user });
    }
}
