import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { getAllowedOrigins } from './common/cors.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  if (!process.env.FRONTEND_URL) {
    logger.warn(
      'FRONTEND_URL environment variable is not defined! CORS and CsrfGuard will only accept localhost origins. Production requests will be rejected with 403 Forbidden.',
    );
  }

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const allowedOrigins = getAllowedOrigins(process.env.FRONTEND_URL);

  app.enableCors({
    // Явно указываем тип (string | undefined) для параметра origin
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const normalized = origin ? origin.trim().replace(/\/+$/, '') : undefined;
      if (!normalized || allowedOrigins.includes(normalized)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
