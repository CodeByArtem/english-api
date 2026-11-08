import 'dotenv/config';
import { DataSource } from 'typeorm';
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
import { InitialSchema1700000000000 } from './migrations/1700000000000-InitialSchema';
import { AddLessonIdToSubmissions1728045200000 } from './migrations/1728045200000-AddLessonIdToSubmissions';
import { AddReviewedAnswersToSubmissions1728054000000 } from './migrations/1728054000000-AddReviewedAnswersToSubmissions';
import { AddAnswerKeyToLessons1728055000000 } from './migrations/1728055000000-AddAnswerKeyToLessons';
import { CreateRefreshTokensTable1791486895272 } from './migrations/1791486895272-CreateRefreshTokensTable';
import { CreateSubmissionAudioTable1792000000000 } from './migrations/1792000000000-CreateSubmissionAudioTable';
import { AddUniqueIndexToSubmissions1792100000000 } from './migrations/1792100000000-AddUniqueIndexToSubmissions';
import { AddStorageKeyToSubmissionAudio1792200000000 } from './migrations/1792200000000-AddStorageKeyToSubmissionAudio';

// DataSource для TypeORM CLI (генерация и запуск миграций вне NestJS)
// Использует DATABASE_URL_UNPOOLED из .env — прямое соединение обязательно для миграций
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false,
  entities: [
    User, Textbook, Unit, Lesson, Exercise, Material,
    Assignment, Submission, SubmissionAudio, Invite, RefreshToken,
  ],
  migrations: [
    InitialSchema1700000000000,
    AddLessonIdToSubmissions1728045200000,
    AddReviewedAnswersToSubmissions1728054000000,
    AddAnswerKeyToLessons1728055000000,
    CreateRefreshTokensTable1791486895272,
    CreateSubmissionAudioTable1792000000000,
    AddUniqueIndexToSubmissions1792100000000,
    AddStorageKeyToSubmissionAudio1792200000000,
  ],
  migrationsTableName: 'migrations',
});
