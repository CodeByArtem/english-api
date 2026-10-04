import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { User } from './users/user.entity';
import { Textbook } from './content/entities/textbook.entity';
import { Unit } from './content/entities/unit.entity';
import { Lesson } from './content/entities/lesson.entity';
import { Exercise } from './content/entities/exercise.entity';
import { Material } from './content/entities/material.entity';
import { Assignment } from './assignments/entities/assignment.entity';
import { Submission } from './assignments/entities/submission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Если есть DATABASE_URL (продакшн на Render)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission],
            synchronize: true, // Внимание: в реальном production лучше использовать миграции
            ssl: {
              rejectUnauthorized: false, // Обязательно для облачной базы данных Render
            },
          };
        }

        // Если DATABASE_URL нет (локальная разработка)
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'password',
          database: configService.get<string>('DB_NAME') || 'english_db',
          entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    ContentModule,
    AssignmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}