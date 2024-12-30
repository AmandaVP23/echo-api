import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { avatarUploadMulterOptions } from 'src/helpers/upload-avatar-config';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MailModule,
        MulterModule.register(avatarUploadMulterOptions),
        AuthenticationModule,
        ServeStaticModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): ServeStaticModuleOptions[] => [
                {
                    rootPath: configService.get<string>('AVATAR_UPLOAD_PATH'),
                    serveRoot: '/avatars',
                },
            ],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
