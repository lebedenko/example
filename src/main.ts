import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const server = express();

  server.set('case sensitive routing', true);
  server.set('etag', false);
  server.set('strict routing', true);
  server.set('trust proxy', true);
  server.set('x-powered-by', false);

  const app = await NestFactory.create(AppModule, server);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
