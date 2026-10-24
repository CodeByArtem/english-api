import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Seeder');
  logger.log('Initializing application context for database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  // Хук onApplicationBootstrap в SeedService выполняется автоматически при инициализации контекста

  logger.log('Database seeding finished successfully.');
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  const logger = new Logger('Seeder');
  logger.error('Database seeding failed:', err);
  process.exit(1);
});
