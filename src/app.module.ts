import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
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
import { RefreshToken } from './auth/entities/refresh-token.entity';
import {
  THROTTLE_TTL,
  THROTTLE_GLOBAL_LIMIT,
  THROTTLE_ERROR_MESSAGE,
} from './auth/throttle.constants';

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
            entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission, Invite, RefreshToken],
            synchronize: true, // Внимание: в реальном production лучше использовать миграции
            ssl: databaseUrl.includes('render.com') ? {
              rejectUnauthorized: false, // SSL только для облачной базы данных Render
            } : false,
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
          entities: [User, Textbook, Unit, Lesson, Exercise, Material, Assignment, Submission, Invite, RefreshToken],
          synchronize: true,
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
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}