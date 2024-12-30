import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private backendUrl: string;

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.backendUrl = configService.get<string>('BACKEND_URL');
    }

    async sendEmail(to: string, subject: string, template: string, context: Record<string, string>) {
        await this.mailerService.sendMail({
            to,
            subject,
            template,
            context: {
                ...context,
                backendUrl: this.backendUrl, // to host publicccc
            },
        });
    }
}
