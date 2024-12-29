import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { avatarUploadMulterOptions } from 'src/helpers/upload-avatar-config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MailModule,
        MulterModule.register(avatarUploadMulterOptions),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
