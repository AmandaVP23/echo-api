import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// email validation = class validator
// todo - only verified users can login
// /me returning wrong user

const PORT = process.env.BACKEND_PORT || 8080;
const WEB_APP_URL = process.env.WEB_APP_URL;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.listen(PORT);
    console.log('*****************************************************');
    console.log(`*                                                   *`);
    console.log(`*               http://localhost:${PORT}               *`);
    console.log(`*               http://localhost:${PORT}/docs          *`);
    console.log(`*                                                   *`);
    console.log('*****************************************************');
}
bootstrap();
