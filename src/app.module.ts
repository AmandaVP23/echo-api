import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatService } from './chat/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProtectedRouteModule } from './protected-route/protected-route.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { ChatModule } from './chat/chat.module';


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get<string>('DATABASE_HOST'),  // Use environment variable for host
                port: configService.get<number>('DATABASE_PORT'),  // Use environment variable for port
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true, // should be false in production
            }),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        MailModule,
        AuthenticationModule,
        ProtectedRouteModule,
        ResetPasswordTokenModule,
        ChatModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'public'),
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // ChatService,
        // {
        //     provide: 'CHAT_PACKAGE',
        //     useFactory: () => ({
        //       transport: Transport.GRPC,
        //       options: {
        //         package: 'chat',
        //         protoPath: 'chat/chat.proto', // Adjust the path to your .proto file
        //         url: 'localhost:5000', // Ensure this is the correct gRPC URL
        //       },
        //     }),
        // },
    ],
})
export class AppModule {}
