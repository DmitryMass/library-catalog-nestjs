import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { GlobalErrorCatcher } from './middleware/error.middleware';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new GlobalErrorCatcher());

  const config = new DocumentBuilder()
    .setTitle('Документація')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const corsOptions: CorsOptions = {
    origin: '*', //need to change
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
