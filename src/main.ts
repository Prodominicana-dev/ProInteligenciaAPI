import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'https://prointeligencia.prodominicana.gob.do',
        'http://localhost:3000',
        'http://webtesting.prodominicana.gob.do',
        'https://prodominicana.gob.do',
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    },
  });
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
