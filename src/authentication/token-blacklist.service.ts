import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectRepository(TokenBlacklist)
        private readonly blacklistRepository: Repository<TokenBlacklist>,
    ) {}

    async addTokenToBlacklist(token: string, expiresAt: Date): Promise<void> {
        const blacklistToken = new TokenBlacklist();
        blacklistToken.token = token;
        blacklistToken.expiresAt = expiresAt;
        await this.blacklistRepository.save(blacklistToken);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const result = await this.blacklistRepository.findOne({ where: { token } });
        return !!result;
    }

    async removeTokenFromBlacklist(token: string): Promise<void> {
        await this.blacklistRepository.delete({ token });
    }
}
