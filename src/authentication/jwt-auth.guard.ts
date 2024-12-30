import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from 'src/authentication/token-blacklist.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly tokenBlacklistService: TokenBlacklistService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers['authorization']?.split(' ')[1]; // Bearer <token>

        const isJwtValid = await super.canActivate(context);

        if (!isJwtValid || !accessToken) {
            throw new UnauthorizedException();
        }

        console.log(this.tokenBlacklistService);

        const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(accessToken);

        if (isBlacklisted) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
