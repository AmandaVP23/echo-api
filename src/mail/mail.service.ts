import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(to: string, subject: string, template: string, context: Record<string, string>) {
        await this.mailerService.sendMail({
            to,
            subject,
            template,
            context,
        });
    }
}
