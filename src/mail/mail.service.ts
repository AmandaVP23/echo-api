import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendVerificationEmail(
        to: string,
        subject: string,
        context: Record<string, string>,
    ) {
        await this.mailerService.sendMail({
            to,
            subject,
            template: 'verify-account',
            context,
        });
    }
}
