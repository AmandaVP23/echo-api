import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GrpcOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

// email validation = class validator
// todo - only verified users can login
// /me returning wrong user

const PORT = process.env.BACKEND_PORT || 8080;
const WEB_APP_URL = process.env.WEB_APP_URL;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    //     transport: Transport.GRPC,
    //     options: {
    //         package: 'chat',
    //         protoPath: join(__dirname, '/chat/chat.proto'),
    //         url: 'localhost:5000',
    //     }
    // });

    const grpcOptions: GrpcOptions = {
        transport: Transport.GRPC,
        options: {
            package: 'chat',
            protoPath: join(__dirname, '/chat/chat.proto'),
            url: 'localhost:5000',
        }
    };

    const config = new DocumentBuilder()
        .setTitle('Echo Chat - API Documentation')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Echo API Docs',
    });

    if (WEB_APP_URL) {
        app.enableCors({
            origin: WEB_APP_URL,
        })
    }

    app.connectMicroservice(grpcOptions);
    await app.startAllMicroservices();
    await app.listen(PORT);
    
    // await grpcApp.listen();
    console.log('*****************************************************');
    console.log(`*                                                   *`);
    console.log(`*               http://localhost:${PORT}               *`);
    console.log(`*               http://localhost:${PORT}/docs          *`);
    console.log(`*                                                   *`);
    console.log('*****************************************************');
    console.log('gRPC server running...');
}
bootstrap();
