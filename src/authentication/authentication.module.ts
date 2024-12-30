import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordTokenModule } from 'src/reset-password-token/reset-password-token.module';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { TokenBlacklistService } from './token-blacklist.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TokenBlacklist]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRATION', '15m'),
                },
            }),
        }),
        forwardRef(() => UsersModule),
        ResetPasswordTokenModule,
        MailModule,
    ],
    providers: [AuthenticationService, JwtStrategy, JwtAuthGuard, TokenBlacklistService],
    controllers: [AuthenticationController],
    exports: [JwtAuthGuard, TokenBlacklistService],
})
export class AuthenticationModule {}
