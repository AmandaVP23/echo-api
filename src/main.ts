import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// email validation = class validator
// todo - only verified users can login
// /me returning wrong user

const PORT = process.env.PORT || 8080;

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

    await app.listen(PORT);
    console.log('*****************************************************');
    console.log(`*                                                   *`);
    console.log(`*               http://localhost:${PORT}               *`);
    console.log(`*               http://localhost:${PORT}/docs          *`);
    console.log(`*                                                   *`);
    console.log('*****************************************************');
}
bootstrap();
