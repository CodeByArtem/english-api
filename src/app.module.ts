import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CsrfGuard } from './common/guards/csrf.guard';
import { AppThrottlerGuard } from './common/guards/app-throttler.guard';
import { getAllowedOrigins } from './common/cors.config';
import { AssignmentsModule } from './assignments/assignments.module';
import { InvitesModule } from './invites/invites.module';
import { User } from './users/user.entity';
import { Invite } from './invites/invite.entity';
import { Textbook } from './content/entities/textbook.entity';
import { Unit } from './content/entities/unit.entity';
import { Lesson } from './content/entities/lesson.entity';
import { Exercise } from './content/entities/exercise.entity';
import { Material } from './content/entities/material.entity';
import { Assignment } from './assignments/entities/assignment.entity';
import { Submission } from './assignments/entities/submission.entity';
import { SubmissionAudio } from './assignments/entities/submission-audio.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { AddLessonIdToSubmissions1728045200000 } from './migrations/1728045200000-AddLessonIdToSubmissions';
import { AddReviewedAnswersToSubmissions1728054000000 } from './migrations/1728054000000-AddReviewedAnswersToSubmissions';
import { AddAnswerKeyToLessons1728055000000 } from './migrations/1728055000000-AddAnswerKeyToLessons';
import { CreateRefreshTokensTable1791486895272 } from './migrations/1791486895272-CreateRefreshTokensTable';
import { CreateSubmissionAudioTable1792000000000 } from './migrations/1792000000000-CreateSubmissionAudioTable';
import { AddUniqueIndexToSubmissions1792100000000 } from './migrations/1792100000000-AddUniqueIndexToSubmissions';
import {
  THROTTLE_TTL,
  THROTTLE_GLOBAL_LIMIT,
  THROTTLE_ERROR_MESSAGE,
} from './auth/throttle.constants';

const databaseMigrations = [
  AddLessonIdToSubmissions1728045200000,
  AddReviewedAnswersToSubmissions1728054000000,
  AddAnswerKeyToLessons1728055000000,
  CreateRefreshTokensTable1791486895272,
  CreateSubmissionAudioTable1792000000000,
  AddUniqueIndexToSubmissions1792100000000,
];

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
        let databaseUrl =
          process.env.DATABASE_URL || configService.get<string>('DATABASE_URL');
        // Если указан хост @db:, но мы запускаемся на хост-машине Windows вне docker,
        // заменяем на localhost, чтобы локальные скрипты (например, npm run seed) успешно подключались к базе
        if (
          databaseUrl &&
          databaseUrl.includes('@db:') &&
          process.platform === 'win32'
        ) {
          databaseUrl = databaseUrl.replace('@db:', '@localhost:');
        }
        // По умолчанию авто-синхронизация включена (как и было до commit fa56ccb),
        // если явно не передано DB_SYNC=false. Это гарантирует создание новых таблиц на Render.
        const dbSync = configService.get<string>('DB_SYNC') !== 'false';

        // Если есть DATABASE_URL (продакшн на Render)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission, SubmissionAudio, Invite, RefreshToken],
            migrations: databaseMigrations,
            migrationsRun: true,
            synchronize: dbSync,
            ssl: databaseUrl.includes('render.com') ? {
              rejectUnauthorized: false, // SSL только для облачной базы данных Render
            } : false,
          };
        }

        // Если DATABASE_URL нет (локальная разработка)
        const configuredHost =
          configService.get<string>('DB_HOST') || 'localhost';
        const dbHost =
          process.platform === 'win32' && configuredHost === 'db'
            ? 'localhost'
            : configuredHost;

        return {
          type: 'postgres',
          host: dbHost,
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'password',
          database: configService.get<string>('DB_NAME') || 'english_db',
          entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission, SubmissionAudio, Invite, RefreshToken],
          migrations: databaseMigrations,
          migrationsRun: true,
          synchronize: dbSync,
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: THROTTLE_TTL,
          limit: THROTTLE_GLOBAL_LIMIT,
        },
      ],
      errorMessage: THROTTLE_ERROR_MESSAGE,
    }),
    UsersModule,
    AuthModule,
    ContentModule,
    AssignmentsModule,
    InvitesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    // CSRF guard проверяет Origin/Referer для всех небезопасных HTTP-методов,
    // если в запросе присутствуют auth-cookie (accessToken или refreshToken).
    {
      provide: APP_GUARD,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CsrfGuard => {
        const allowedOrigins = getAllowedOrigins(
          configService.get<string>('FRONTEND_URL'),
        );
        return new CsrfGuard(allowedOrigins);
      },
    },
  ],
})
export class AppModule {}