import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
    providers: [MailService],
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'localhost',
                port: 1025,
                secure: false,
            },
            defaults: {
                from: '"No Reply" <noreply@echo-chat.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
            },
        }),
    ],
    exports: [MailService],
})
export class MailModule {}
