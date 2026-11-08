import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  PayloadTooLargeException,
  Logger,
  Optional,
} from '@nestjs/common';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionAudio } from './entities/submission-audio.entity';
import { Lesson } from '../content/entities/lesson.entity';
import { User } from '../users/user.entity';
import { StorageService } from '../storage/storage.service';
import { Role } from '../common/role.enum';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UploadedAudioFile } from './interfaces/audio-file.interface';

export type {
  GradingDetails,
  GradingResult,
  SubmissionAnswers,
  ReviewedAnswers,
} from './types/submission.types';
import type {
  GradingDetails,
  GradingResult,
  SubmissionAnswers,
} from './types/submission.types';

export interface RequestUser {
  id: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export type AssignmentSubmissionStatus =
  | 'pending'
  | 'submitted'
  | 'graded'
  | 'needs_revision';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SubmissionAudio)
    private readonly submissionAudioRepository: Repository<SubmissionAudio>,
    @Optional()
    private readonly storageService?: StorageService,
  ) {}

  async getStudentsList() {
    return this.userRepository.find({
      where: { role: Role.STUDENT },
      select: { id: true, email: true },
      order: { email: 'ASC' },
    });
  }

  async createAssignment(
    title: string,
    description: string | null,
    dueDate: Date | null,
    attachmentUrl: string | null = null,
    studentId: string | null = null,
    teacherId: string | null = null,
    lessonId: string | null = null,
  ) {
    const assignment = this.assignmentRepository.create({
      title,
      description,
      dueDate,
      attachmentUrl,
      student: studentId ? ({ id: studentId } as User) : null,
      teacher: teacherId ? ({ id: teacherId } as User) : null,
      lesson: lessonId ? ({ id: lessonId } as Lesson) : null,
    });
    return this.assignmentRepository.save(assignment);
  }

  async findAllForUser(user: RequestUser) {
    const isStudent = user?.role?.toLowerCase() === Role.STUDENT;

    const assignments = await this.assignmentRepository.find({
      relations: {
        lesson: true,
        student: true,
        teacher: true,
        submissions: {
          student: true,
        },
      },
      order: {
        dueDate: 'ASC',
      },
    });

    const filtered = isStudent
      ? assignments.filter((a) => !a.student || a.student.id === user.id)
      : assignments;

    return filtered.map((assignment) => {
      let status: AssignmentSubmissionStatus = 'pending';
      let grade: number | null = null;
      let submissionId: string | null = null;

      if (assignment.submissions) {
        const studentSub = isStudent
          ? assignment.submissions.find((s) => s.student?.id === user.id)
          : assignment.submissions[0];

        if (studentSub) {
          status = (studentSub.status || 'submitted') as AssignmentSubmissionStatus;
          grade = studentSub.grade ?? studentSub.score ?? null;
          submissionId = studentSub.id;
        }
      }

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        attachmentUrl: assignment.attachmentUrl,
        lessonId: assignment.lesson?.id,
        assignedStudent: assignment.student
          ? { id: assignment.student.id, email: assignment.student.email }
          : null,
        submissionsCount: assignment.submissions?.length || 0,
        status,
        grade,
        submissionId,
      };
    });
  }

  async findOneForUser(id: string, user: RequestUser) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: {
        lesson: {
          exercises: true,
        },
        submissions: {
          student: true,
        },
        student: true,
        teacher: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const isStudent = user?.role?.toLowerCase() === Role.STUDENT;
    if (isStudent && assignment.student && assignment.student.id !== user.id) {
      throw new ForbiddenException('This assignment is not assigned to you');
    }

    const studentSub = isStudent
      ? assignment.submissions?.find((s) => s.student?.id === user.id)
      : null;

    const rawContent =
      studentSub?.answers?.text ||
      (typeof studentSub?.answers === 'string'
        ? studentSub.answers
        : studentSub?.answers
        ? JSON.stringify(studentSub.answers)
        : '');

    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      attachmentUrl: assignment.attachmentUrl,
      lessonId: assignment.lesson?.id,
      lesson: assignment.lesson,
      assignedStudent: assignment.student
        ? { id: assignment.student.id, email: assignment.student.email }
        : null,
      status: studentSub?.status || 'pending',
      submission: studentSub
        ? {
            id: studentSub.id,
            content: rawContent,
            submittedAt: studentSub.createdAt,
            grade: studentSub.grade ?? studentSub.score ?? undefined,
            feedback: studentSub.tutorComment || undefined,
            status: studentSub.status,
          }
        : undefined,
    };
  }

  async findByLessonId(lessonId: string) {
    if (!lessonId) return [];
    return this.assignmentRepository.find({
      where: { lesson: { id: lessonId } },
      relations: { submissions: true },
    });
  }

  async createSubmission(
    dto: CreateSubmissionDto,
    studentId: string,
  ) {
    if (!dto.lessonId && !dto.assignmentId) {
      throw new BadRequestException('lessonId or assignmentId is required');
    }

    let assignment: Assignment | null = null;
    let lesson: Lesson | null = null;

    if (dto.assignmentId) {
      assignment = await this.assignmentRepository.findOne({
        where: { id: dto.assignmentId },
        relations: { lesson: { exercises: true } },
      });
      if (!assignment) throw new NotFoundException('Assignment not found');
      lesson = assignment.lesson;

      if (dto.lessonId && lesson && dto.lessonId !== lesson.id) {
        throw new BadRequestException('lessonId does not match assignment lesson');
      }
    } else if (dto.lessonId) {
      lesson = await this.lessonRepository.findOne({
        where: { id: dto.lessonId },
        relations: { exercises: true },
      });
      if (!lesson) throw new NotFoundException('Lesson not found');
    }

    if (!lesson && !assignment) {
      throw new BadRequestException('Valid lessonId or assignmentId is required');
    }

    if (lesson) {
      this.logger.debug(`Lesson found: ${lesson.id} ${lesson.title}`);
    }

    // Выполняем проверку и запись сдачи.
    // Хелпер executeSubmissionWrite позволяет работать как внутри TypeORM-транзакции в БД,
    // так и напрямую с submissionRepository в юнит-тестах с моками.
    const executeSubmissionWrite = async (repo: Repository<Submission>) => {
      // Check if student already has a submission for this lesson / assignment
      const existingSubmission = await repo.findOne({
        where: lesson
          ? { student: { id: studentId }, lesson: { id: lesson.id } }
          : { student: { id: studentId }, assignment: { id: assignment!.id } },
        order: { createdAt: 'DESC' },
      });

      if (existingSubmission) {
        if (existingSubmission.status === 'submitted') {
          throw new BadRequestException(
            'You have already submitted this homework. It is currently under review by your teacher.',
          );
        }
        if (existingSubmission.status === 'graded') {
          throw new BadRequestException(
            'This homework has already been graded and cannot be resubmitted.',
          );
        }
        if (existingSubmission.status === 'needs_revision') {
          // Upon revision request, update the existing submission instead of creating duplicate
          const { score, details } = lesson
            ? this.calculateScore(lesson, dto.answers)
            : { score: 0, details: null };
          existingSubmission.answers = dto.answers;
          existingSubmission.reviewedAnswers = null; // Сбрасываем старые рецензии учителя
          existingSubmission.grade = null; // Сбрасываем старую ручную оценку
          existingSubmission.tutorComment = null; // Сбрасываем старый комментарий ревизии
          existingSubmission.score = score;
          existingSubmission.details = details;
          existingSubmission.status = 'submitted'; // return to teacher for re-checking
          const updated = await repo.save(existingSubmission);
          return {
            id: updated.id,
            score: updated.score,
            status: updated.status,
            answers: updated.answers,
            lesson: updated.lesson
              ? { id: updated.lesson.id, title: updated.lesson.title }
              : null,
            assignment: updated.assignment,
            createdAt: updated.createdAt,
          };
        }
      }

      // Автоматическая проверка ответов (если есть урок)
      const { score, details } = lesson
        ? this.calculateScore(lesson, dto.answers)
        : { score: 0, details: null };

      const submission = repo.create({
        answers: dto.answers,
        assignment: assignment || null,
        lesson: lesson || null,
        student: { id: studentId } as User,
        score,
        details,
        status: 'submitted',
      });

      const savedSubmission = await repo.save(submission);

      // Возвращаем score и answers для студента (без details)
      return {
        id: savedSubmission.id,
        score: savedSubmission.score,
        status: savedSubmission.status,
        answers: savedSubmission.answers,
        lesson: savedSubmission.lesson
          ? { id: savedSubmission.lesson.id, title: savedSubmission.lesson.title }
          : null,
        assignment: savedSubmission.assignment,
        createdAt: savedSubmission.createdAt,
      };
    };

    try {
      if (typeof this.submissionRepository.manager?.transaction === 'function') {
        return await this.submissionRepository.manager.transaction(async (manager) => {
          const transactionalRepo = manager.getRepository(Submission);
          return await executeSubmissionWrite(transactionalRepo);
        });
      }
      return await executeSubmissionWrite(this.submissionRepository);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string } | null;
      if (
        err?.code === '23505' ||
        (typeof err?.message === 'string' &&
          (err.message.includes('idx_submissions_unique_student_lesson') ||
            err.message.includes('duplicate key value violates unique constraint')))
      ) {
        throw new BadRequestException(
          'You have already submitted this homework. It is currently under review by your teacher.',
        );
      }
      throw error;
    }
  }

  normalizeAnswer(val: unknown): string {
    if (val === null || val === undefined) return '';
    return String(val)
      .trim()
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[,;!]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\.+$/, '');
  }

  matchesAnswer(studentVal: unknown, expected: unknown): boolean {
    const normalizedStudent = this.normalizeAnswer(studentVal);
    if (!normalizedStudent) return false;

    if (Array.isArray(expected)) {
      return expected.some(
        (exp) => this.normalizeAnswer(exp) === normalizedStudent,
      );
    }
    return this.normalizeAnswer(expected) === normalizedStudent;
  }

  /**
   * Проверяет, является ли элемент ключа примером учебника или исключённым из проверки
   */
  public isIgnoredOrExample(
    key: string,
    item: unknown,
    container?: Record<string, unknown> | object,
  ): boolean {
    if (key.startsWith('_')) {
      return true;
    }

    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const obj = item as Record<string, unknown>;
      if (obj.isExample === true || obj.ignored === true) {
        return true;
      }
    }

    if (container && typeof container === 'object') {
      const record = container as Record<string, unknown>;
      const ignoredList =
        record._ignored ||
        record._examples ||
        record.ignoredKeys ||
        record.examples;
      if (Array.isArray(ignoredList)) {
        const normKey = this.normalizeAnswer(key);
        if (ignoredList.some((k: unknown) => this.normalizeAnswer(k) === normKey)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Извлекает фактическое эталонное значение ответа из примитива или объекта с метаданными
   */
  public extractExpectedValue(val: unknown): unknown {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const obj = val as Record<string, unknown>;
      if ('value' in obj) return obj.value;
      if ('expected' in obj) return obj.expected;
      if ('answer' in obj) return obj.answer;
    }
    return val;
  }

  public calculateScore(
    lesson: Lesson,
    studentAnswers: SubmissionAnswers,
  ): GradingResult {
    if (!lesson) {
      return { score: 0, details: {} };
    }

    const answerKey = (lesson.answerKey || {}) as Record<string, unknown>;
    const answers = (studentAnswers || {}) as Record<string, unknown>;
    const flagAnswers = (answers.flagAnswers || {}) as Record<string, unknown>;
    const dialogInputs = (answers.dialogInputs || {}) as Record<string, unknown>;
    const stressTableInputs = (answers.stressTableInputs || {}) as Record<string, string>;
    const grammarInputs = (answers.grammarInputs || {}) as Record<string, unknown>;
    const dialogue7aInputs = (answers.dialogue7aInputs || {}) as Record<string, unknown>;

    let totalQuestions = 0;
    let correctAnswers = 0;
    const failedQuestions: string[] = [];

    const handledLesson1AKeys = new Set([
      'exercise_1a_flags',
      'exercise_2a_stress',
      'exercise_4a_dialogues',
      'exercise_5_grammar',
      'exercise_7a_dialogue',
    ]);

    // Exercise 1a: Flags - считаем все вопросы из answerKey
    if (answerKey.exercise_1a_flags) {
      const expectedFlags = answerKey.exercise_1a_flags;
      for (const [flagId, expectedCountry] of Object.entries(expectedFlags)) {
        if (this.isIgnoredOrExample(flagId, expectedCountry, expectedFlags)) {
          continue;
        }
        totalQuestions++;
        const studentAnswer = flagAnswers[flagId];
        const actualExpected = this.extractExpectedValue(expectedCountry);
        if (this.matchesAnswer(studentAnswer, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`exercise_1a_flags.${flagId}`);
        }
      }
    }

    // Exercise 2a: Stress table - считаем все страны из answerKey
    if (answerKey.exercise_2a_stress) {
      const expectedStress = answerKey.exercise_2a_stress;
      for (const [country, expectedPattern] of Object.entries(expectedStress)) {
        if (this.isIgnoredOrExample(country, expectedPattern, expectedStress)) {
          continue;
        }

        totalQuestions++;
        // Ищем ответ студента для этой страны
        const normalizedCountry = this.normalizeAnswer(country);
        let studentPattern: string | null = null;
        for (const [key, value] of Object.entries(stressTableInputs)) {
          if (key === 'my_country') continue;
          if (this.normalizeAnswer(value) === normalizedCountry) {
            studentPattern = key.replace(/_\d+$/, ''); // Remove _1, _2 suffix
            break;
          }
        }
        const actualExpected = this.extractExpectedValue(expectedPattern);
        if (this.matchesAnswer(studentPattern, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`exercise_2a_stress.${country}`);
        }
      }
    }

    // Exercise 4a: Dialogues - считаем все gaps из answerKey
    if (answerKey.exercise_4a_dialogues) {
      const expectedDialogues = answerKey.exercise_4a_dialogues;
      const keyMapping: Record<string, string> = {
        'c1_1': 'gap_1',
        'c1_2': 'gap_2',
        'c2_1': 'gap_3',
        'c2_2': 'gap_4',
      };

      for (const [gapKey, expectedCountry] of Object.entries(expectedDialogues)) {
        if (this.isIgnoredOrExample(gapKey, expectedCountry, expectedDialogues)) {
          continue;
        }
        totalQuestions++;
        const frontendKey = Object.entries(keyMapping).find(([, v]) => v === gapKey)?.[0];
        const studentAnswer = frontendKey ? dialogInputs[frontendKey] : null;
        const actualExpected = this.extractExpectedValue(expectedCountry);
        if (this.matchesAnswer(studentAnswer, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`exercise_4a_dialogues.${gapKey}`);
        }
      }
    }

    // Exercise 5: Grammar - Short forms
    if (answerKey.exercise_5_grammar) {
      const expectedGrammar = answerKey.exercise_5_grammar;
      for (const [gapId, expected] of Object.entries(expectedGrammar)) {
        if (this.isIgnoredOrExample(gapId, expected, expectedGrammar)) {
          continue;
        }
        totalQuestions++;
        const studentAnswer = grammarInputs[gapId];
        const actualExpected = this.extractExpectedValue(expected);
        if (this.matchesAnswer(studentAnswer, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`exercise_5_grammar.${gapId}`);
        }
      }
    }

    // Exercise 7a: Dialogue with be
    if (answerKey.exercise_7a_dialogue) {
      const expectedDialogue7a = answerKey.exercise_7a_dialogue;
      for (const [gapId, expected] of Object.entries(expectedDialogue7a)) {
        if (this.isIgnoredOrExample(gapId, expected, expectedDialogue7a)) {
          continue;
        }
        totalQuestions++;
        const studentAnswer = dialogue7aInputs[gapId];
        const actualExpected = this.extractExpectedValue(expected);
        if (this.matchesAnswer(studentAnswer, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`exercise_7a_dialogue.${gapId}`);
        }
      }
    }

    // Универсальная динамическая проверка остальных секций в answerKey
    for (const [sectionKey, sectionValue] of Object.entries(answerKey)) {
      if (handledLesson1AKeys.has(sectionKey) || sectionKey.startsWith('_')) continue;

      if (sectionValue && typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
        const studentSection = (answers[sectionKey] || {}) as Record<string, unknown>;
        for (const [qKey, expectedVal] of Object.entries(sectionValue as Record<string, unknown>)) {
          if (this.isIgnoredOrExample(qKey, expectedVal, sectionValue as Record<string, unknown>)) {
            continue;
          }
          totalQuestions++;
          const studentVal = studentSection[qKey] ?? answers[qKey];
          const actualExpected = this.extractExpectedValue(expectedVal);
          if (this.matchesAnswer(studentVal, actualExpected)) {
            correctAnswers++;
          } else {
            failedQuestions.push(`${sectionKey}.${qKey}`);
          }
        }
      } else {
        if (this.isIgnoredOrExample(sectionKey, sectionValue, answerKey as Record<string, unknown>)) {
          continue;
        }
        totalQuestions++;
        const studentVal = answers[sectionKey];
        const actualExpected = this.extractExpectedValue(sectionValue);
        if (this.matchesAnswer(studentVal, actualExpected)) {
          correctAnswers++;
        } else {
          failedQuestions.push(`${sectionKey}`);
        }
      }
    }

    // Динамическая проверка exercises сущностей (если answerKey был пуст или не содержал вопросов)
    if (totalQuestions === 0 && Array.isArray(lesson.exercises) && lesson.exercises.length > 0) {
      for (const exercise of lesson.exercises) {
        const payload = (exercise.payload || {}) as Record<string, unknown>;
        if (exercise.type === 'multiple_choice' && payload.correctAnswer) {
          totalQuestions++;
          const studentVal = answers[exercise.id] ?? answers[exercise.order];
          if (this.matchesAnswer(studentVal, payload.correctAnswer)) {
            correctAnswers++;
          } else {
            failedQuestions.push(String(exercise.id || exercise.order));
          }
        } else if (exercise.type === 'text_input' && payload.answer) {
          totalQuestions++;
          const studentVal = answers[exercise.id] ?? answers[exercise.order];
          if (this.matchesAnswer(studentVal, payload.answer)) {
            correctAnswers++;
          } else {
            failedQuestions.push(String(exercise.id || exercise.order));
          }
        } else if (exercise.type === 'fill_in_the_blank' && Array.isArray(payload.gaps)) {
          const studentGaps = (answers[exercise.id] || answers) as Record<string, unknown>;
          for (const gap of payload.gaps as Array<{ id?: string; answer?: unknown }>) {
            if (gap.id && gap.answer) {
              totalQuestions++;
              const studentVal = studentGaps[gap.id];
              if (this.matchesAnswer(studentVal, gap.answer)) {
                correctAnswers++;
              } else {
                failedQuestions.push(`${exercise.id || exercise.order}.${gap.id}`);
              }
            }
          }
        }
      }
    }

    if (totalQuestions === 0) {
      return { score: 0, details: {} };
    }

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

    const details: GradingDetails = {
      totalQuestions,
      correctAnswers,
      failedQuestions,
      gradedAt: new Date().toISOString(),
    };

    return { score: finalScore, details };
  }

  async getTeacherStats(limit: number = 100) {
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);

    return this.submissionRepository.find({
      relations: {
        student: true,
        lesson: true,
        assignment: {
          lesson: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: safeLimit,
      select: {
        id: true,
        score: true,
        grade: true,
        status: true,
        tutorComment: true,
        createdAt: true,
        student: {
          id: true,
          email: true,
        },
        lesson: {
          id: true,
          title: true,
        },
        assignment: {
          id: true,
          title: true,
          lesson: {
            title: true,
          },
        },
      },
    });
  }

  assertCanAccessSubmission(user: RequestUser, submission: Submission): void {
    const role = user?.role?.toUpperCase();
    if (role === 'TUTOR') {
      return;
    }
    if (role === 'STUDENT') {
      if (submission.student?.id === user?.id) {
        return;
      }
      throw new ForbiddenException('You can only access your own submissions');
    }
    throw new ForbiddenException('Access denied');
  }

  async getSubmissionById(id: string, user: RequestUser) {
    let submission: Submission | null = null;
    try {
      submission = await this.submissionRepository.findOne({
        where: { id },
        relations: {
          student: true,
          lesson: {
            exercises: true,
          },
          assignment: {
            lesson: true,
          },
          audios: true,
        },
      });
    } catch (dbErr: unknown) {
      // Безопасный откат: если таблица submission_audio ещё отсутствует в БД (до синхронизации)
      // или relation audios вызывает ошибку, загружаем сущность без audios,
      // чтобы учитель и ученик не получали 500 ошибку при открытии страницы
      const message = dbErr instanceof Error ? dbErr.message : String(dbErr);
      this.logger.warn(`Failed to fetch submission with audios relation: ${message}`);
      submission = await this.submissionRepository.findOne({
        where: { id },
        relations: {
          student: true,
          lesson: {
            exercises: true,
          },
          assignment: {
            lesson: true,
          },
        },
      });
    }

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    this.assertCanAccessSubmission(user, submission);

    const audios = (submission.audios || []).map((a) => ({
      exerciseKey: a.exerciseKey,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
    }));

    const role = user?.role?.toUpperCase();
    if (role === 'STUDENT' && submission.lesson) {
      const { answerKey: _answerKey, ...lessonWithoutAnswerKey } = submission.lesson;
      return {
        ...submission,
        lesson: lessonWithoutAnswerKey,
        audios,
      };
    }

    return {
      ...submission,
      audios,
    };
  }

  async saveSubmissionAudio(
    submissionId: string,
    exerciseKey: string,
    file: UploadedAudioFile,
    user: RequestUser,
  ) {
    const role = user?.role?.toUpperCase();
    if (role !== 'STUDENT') {
      throw new ForbiddenException('Only students can upload audio submissions');
    }

    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB
    if (file.size > MAX_FILE_SIZE) {
      throw new PayloadTooLargeException('File size exceeds 1.5 MB limit');
    }

    const rawMime = file.mimetype || '';
    const normalizedMimeType = rawMime.split(';')[0].trim().toLowerCase();
    const allowedMimeTypes = ['audio/webm', 'audio/ogg', 'audio/mp4'];
    if (!allowedMimeTypes.includes(normalizedMimeType)) {
      throw new BadRequestException(
        `Invalid audio mimeType: "${file.mimetype}". Allowed mime types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: { student: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    this.assertCanAccessSubmission(user, submission);

    let audioRecord = await this.submissionAudioRepository.findOne({
      where: {
        submission: { id: submissionId },
        exerciseKey,
      },
    });

    let storageKey: string | null = null;
    if (this.storageService?.isConfigured()) {
      const generatedKey = `submissions/${submissionId}/${exerciseKey}.webm`;
      storageKey = await this.storageService.uploadAudio(
        generatedKey,
        file.buffer,
        file.mimetype,
      );
    }

    if (audioRecord) {
      audioRecord.mimeType = file.mimetype;
      audioRecord.sizeBytes = file.size;
      audioRecord.storageKey = storageKey;
      audioRecord.data = storageKey ? null : file.buffer;
    } else {
      audioRecord = this.submissionAudioRepository.create({
        submission,
        exerciseKey,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey,
        data: storageKey ? null : file.buffer,
      });
    }

    const saved = await this.submissionAudioRepository.save(audioRecord);

    return {
      id: saved.id,
      exerciseKey: saved.exerciseKey,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
      storageKey: saved.storageKey,
    };
  }

  async getSubmissionAudio(
    submissionId: string,
    exerciseKey: string,
    user: RequestUser,
  ): Promise<{
    id: string;
    exerciseKey: string;
    mimeType: string;
    sizeBytes: number;
    data?: Buffer | null;
    stream?: Readable | null;
  }> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: { student: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    this.assertCanAccessSubmission(user, submission);

    const audio = await this.submissionAudioRepository.findOne({
      where: {
        submission: { id: submissionId },
        exerciseKey,
      },
      select: {
        id: true,
        exerciseKey: true,
        mimeType: true,
        sizeBytes: true,
        storageKey: true,
        data: true,
      },
    });

    if (!audio) {
      throw new NotFoundException(`Audio not found for exercise "${exerciseKey}"`);
    }

    if (audio.storageKey && this.storageService?.isConfigured()) {
      try {
        const s3Object = await this.storageService.getAudioStream(audio.storageKey);
        return {
          id: audio.id,
          exerciseKey: audio.exerciseKey,
          mimeType: s3Object.mimeType || audio.mimeType,
          sizeBytes: s3Object.contentLength || audio.sizeBytes,
          stream: s3Object.stream,
          data: null,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Failed to retrieve S3 audio object "${audio.storageKey}": ${msg}`);
      }
    }

    if (audio.data) {
      return {
        id: audio.id,
        exerciseKey: audio.exerciseKey,
        mimeType: audio.mimeType,
        sizeBytes: audio.sizeBytes,
        data: audio.data,
        stream: null,
      };
    }

    throw new NotFoundException(`Audio data not found for exercise "${exerciseKey}"`);
  }

  async getSubmissionsByStudent(studentId: string) {
    return this.submissionRepository.find({
      where: { student: { id: studentId } },
      relations: {
        lesson: true,
        assignment: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async gradeSubmission(
    submissionId: string,
    grade: number,
    tutorComment: string,
  ) {
    return this.reviewSubmission(submissionId, { grade, tutorComment });
  }

  async reviewSubmission(submissionId: string, dto: ReviewSubmissionDto) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: { student: true, lesson: true, assignment: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const updatedAnswers = dto.answers !== undefined ? dto.answers : dto.reviewedAnswers;
    if (updatedAnswers !== undefined) {
      submission.reviewedAnswers = updatedAnswers;
    }
    if (dto.grade !== undefined) {
      submission.grade = dto.grade;
    }
    if (dto.tutorComment !== undefined) {
      submission.tutorComment = dto.tutorComment;
    }

    submission.status = dto.status || 'graded';

    return this.submissionRepository.save(submission);
  }

  async deleteSubmission(submissionId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: { audios: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (this.storageService?.isConfigured() && submission.audios?.length) {
      for (const audio of submission.audios) {
        if (audio.storageKey) {
          await this.storageService.deleteAudio(audio.storageKey);
        }
      }
    }

    await this.submissionRepository.remove(submission);
    return { success: true, message: 'Submission deleted successfully' };
  }

  async deleteAssignment(id: string) {
    const assignment = await this.assignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    await this.assignmentRepository.remove(assignment);
    return { success: true, message: 'Assignment deleted successfully' };
  }

  async submitTextAssignment(assignmentId: string, studentId: string, content: string) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: { student: true, lesson: true },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.student && assignment.student.id !== studentId) {
      throw new ForbiddenException('This assignment is not assigned to you');
    }

    let submission = await this.submissionRepository.findOne({
      where: {
        assignment: { id: assignmentId },
        student: { id: studentId },
      },
    });

    if (submission) {
      if (submission.status === 'graded') {
        throw new BadRequestException(
          'This assignment has already been graded and cannot be resubmitted.',
        );
      }
      submission.answers = { text: content };
      submission.reviewedAnswers = null;
      submission.grade = null;
      submission.tutorComment = null;
      submission.status = 'submitted';
    } else {
      submission = this.submissionRepository.create({
        assignment,
        lesson: assignment.lesson || null,
        student: { id: studentId } as User,
        answers: { text: content },
        status: 'submitted',
      });
    }

    return this.submissionRepository.save(submission);
  }

  async getStudentSubmissionForLesson(studentId: string, lessonId: string) {
    return this.submissionRepository.findOne({
      where: {
        student: { id: studentId },
        lesson: { id: lessonId },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
