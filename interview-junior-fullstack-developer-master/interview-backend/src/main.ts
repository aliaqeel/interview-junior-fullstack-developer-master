import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(3000);
}
bootstrap();
