import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  Logger.log(
    `🚀 GraphQL Playground is running on: http://localhost:${port}/graphql`,
    'Bootstrap',
  );
}
void bootstrap();
