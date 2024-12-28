import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 8080;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    console.log('hsedesssssy');
    await app.listen(PORT);
    console.log('*********************************');
    console.log(`*                               *`);
    console.log(`*     http://localhost:${PORT}     *`);
    console.log(`*                               *`);
    console.log('*********************************');
}
bootstrap();
