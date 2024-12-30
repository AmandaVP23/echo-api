import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProtectedRouteModule } from './protected-route/protected-route.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// hey

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mariadb',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'echo-chat',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // should be false in production
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        MailModule,
        AuthenticationModule,
        ProtectedRouteModule,
        ResetPasswordTokenModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'public'),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
