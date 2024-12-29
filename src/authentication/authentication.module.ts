import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>(
                        'JWT_EXPIRATION',
                        '15m',
                    ),
                },
            }),
        }),
        forwardRef(() => UsersModule),
    ],
    providers: [AuthenticationService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthenticationController],
    exports: [JwtAuthGuard],
})
export class AuthenticationModule {}
