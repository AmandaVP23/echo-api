// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ChatController } from './chat.controller';

@Module({
    controllers: [ChatController],
    imports: [],
    providers: [
        ChatService,
        {
            provide: 'CHAT_PACKAGE',
            useFactory: () => ({
                transport: Transport.GRPC,
                options: {
                package: 'chat', // Package name in your .proto file
                protoPath: join(__dirname, './chat.proto'), // Path to the .proto file
                url: 'localhost:5000', // Port for gRPC
                },
            }),
        },
    ],
})
export class ChatModule {}
