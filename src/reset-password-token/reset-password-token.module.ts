import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset-password-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PasswordResetToken])],
    providers: [ResetPasswordTokenService],
    exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
