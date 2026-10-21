import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  PayloadTooLargeException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionAudio } from './entities/submission-audio.entity';
import { Lesson } from '../content/entities/lesson.entity';
import { User } from '../users/user.entity';
import { Role } from '../common/role.enum';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UploadedAudioFile } from './interfaces/audio-file.interface';

export interface GradingDetails {
  totalQuestions?: number;
  correctAnswers?: number;
  gradedAt?: string;
  [key: string]: unknown;
}

export interface GradingResult {
  score: number;
  details: GradingDetails;
}

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
      student: studentId ? ({ id: studentId } as any) : null,
      teacher: teacherId ? ({ id: teacherId } as any) : null,
      lesson: lessonId ? ({ id: lessonId } as any) : null,
    });
    return this.assignmentRepository.save(assignment);
  }

  async findAllForUser(user: any) {
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
      let status: 'pending' | 'submitted' | 'graded' | 'needs_revision' = 'pending';
      let grade: number | null = null;
      let submissionId: string | null = null;

      if (assignment.submissions) {
        const studentSub = isStudent
          ? assignment.submissions.find((s) => s.student?.id === user.id)
          : assignment.submissions[0];

        if (studentSub) {
          status = studentSub.status as any;
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

  async findOneForUser(id: string, user: any) {
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

    // Check if student already has a submission for this lesson / assignment
    const existingSubmission = await this.submissionRepository.findOne({
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
        existingSubmission.score = score;
        existingSubmission.details = details;
        existingSubmission.status = 'submitted'; // return to teacher for re-checking
        const updated = await this.submissionRepository.save(existingSubmission);
        return {
          id: updated.id,
          score: updated.score,
          status: updated.status,
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

    const submission = this.submissionRepository.create({
      answers: dto.answers,
      assignment: assignment || null,
      lesson: lesson || null,
      student: { id: studentId } as any,
      score,
      details,
      status: 'submitted',
    });
    
    const savedSubmission = await this.submissionRepository.save(submission);

    // Возвращаем только score для студента (без details)
    return {
      id: savedSubmission.id,
      score: savedSubmission.score,
      status: savedSubmission.status,
      lesson: savedSubmission.lesson
        ? { id: savedSubmission.lesson.id, title: savedSubmission.lesson.title }
        : null,
      assignment: savedSubmission.assignment,
      createdAt: savedSubmission.createdAt
    };
  }

  normalizeAnswer(val: any): string {
    if (val === null || val === undefined) return '';
    return String(val)
      .trim()
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[,;!]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\.+$/, '');
  }

  matchesAnswer(studentVal: any, expected: any): boolean {
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
    container?: Record<string, any>,
  ): boolean {
    if (key.startsWith('_')) {
      return true;
    }

    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const obj = item as Record<string, any>;
      if (obj.isExample === true || obj.ignored === true) {
        return true;
      }
    }

    if (container) {
      const ignoredList =
        container._ignored ||
        container._examples ||
        container.ignoredKeys ||
        container.examples;
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
  public extractExpectedValue(val: any): any {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('value' in val) return val.value;
      if ('expected' in val) return val.expected;
      if ('answer' in val) return val.answer;
    }
    return val;
  }

  public calculateScore(
    lesson: Lesson,
    studentAnswers: Record<string, any>,
  ): GradingResult {
    if (!lesson) {
      return { score: 0, details: {} };
    }

    const answerKey = lesson.answerKey || {};
    const answers = studentAnswers || {};
    const flagAnswers = answers.flagAnswers || {};
    const dialogInputs = answers.dialogInputs || {};
    const stressTableInputs = answers.stressTableInputs || {};
    const grammarInputs = answers.grammarInputs || {};
    const dialogue7aInputs = answers.dialogue7aInputs || {};

    let totalQuestions = 0;
    let correctAnswers = 0;

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
        }
      }
    }

    // Универсальная динамическая проверка остальных секций в answerKey
    for (const [sectionKey, sectionValue] of Object.entries(answerKey)) {
      if (handledLesson1AKeys.has(sectionKey) || sectionKey.startsWith('_')) continue;

      if (sectionValue && typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
        const studentSection = answers[sectionKey] || {};
        for (const [qKey, expectedVal] of Object.entries(sectionValue as Record<string, any>)) {
          if (this.isIgnoredOrExample(qKey, expectedVal, sectionValue as Record<string, any>)) {
            continue;
          }
          totalQuestions++;
          const studentVal = studentSection[qKey] ?? answers[qKey];
          const actualExpected = this.extractExpectedValue(expectedVal);
          if (this.matchesAnswer(studentVal, actualExpected)) {
            correctAnswers++;
          }
        }
      } else {
        if (this.isIgnoredOrExample(sectionKey, sectionValue, answerKey as Record<string, any>)) {
          continue;
        }
        totalQuestions++;
        const studentVal = answers[sectionKey];
        const actualExpected = this.extractExpectedValue(sectionValue);
        if (this.matchesAnswer(studentVal, actualExpected)) {
          correctAnswers++;
        }
      }
    }

    // Динамическая проверка exercises сущностей (если answerKey был пуст или не содержал вопросов)
    if (totalQuestions === 0 && Array.isArray(lesson.exercises) && lesson.exercises.length > 0) {
      for (const exercise of lesson.exercises) {
        const payload = exercise.payload || {};
        if (exercise.type === 'multiple_choice' && payload.correctAnswer) {
          totalQuestions++;
          const studentVal = answers[exercise.id] ?? answers[exercise.order];
          if (this.matchesAnswer(studentVal, payload.correctAnswer)) {
            correctAnswers++;
          }
        } else if (exercise.type === 'text_input' && payload.answer) {
          totalQuestions++;
          const studentVal = answers[exercise.id] ?? answers[exercise.order];
          if (this.matchesAnswer(studentVal, payload.answer)) {
            correctAnswers++;
          }
        } else if (exercise.type === 'fill_in_the_blank' && Array.isArray(payload.gaps)) {
          const studentGaps = answers[exercise.id] || answers;
          for (const gap of payload.gaps) {
            if (gap.id && gap.answer) {
              totalQuestions++;
              const studentVal = studentGaps[gap.id];
              if (this.matchesAnswer(studentVal, gap.answer)) {
                correctAnswers++;
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

    const details = {
      totalQuestions,
      correctAnswers,
      gradedAt: new Date().toISOString(),
    };

    return { score: finalScore, details };
  }

  async getTeacherStats() {
    return this.submissionRepository.find({
      relations: {
        student: true,
        lesson: true,
        assignment: true,
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        score: true,
        grade: true,
        status: true,
        answers: true,
        reviewedAnswers: true,
        tutorComment: true,
        details: true,
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
        },
      },
    });
  }

  assertCanAccessSubmission(user: any, submission: Submission): void {
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

  async getSubmissionById(id: string, user: any) {
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
    } catch (dbErr: any) {
      // Безопасный откат: если таблица submission_audio ещё отсутствует в БД (до синхронизации)
      // или relation audios вызывает ошибку, загружаем сущность без audios,
      // чтобы учитель и ученик не получали 500 ошибку при открытии страницы
      this.logger.warn(`Failed to fetch submission with audios relation: ${dbErr?.message || dbErr}`);
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
    user: any,
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

    if (audioRecord) {
      audioRecord.data = file.buffer;
      audioRecord.mimeType = file.mimetype;
      audioRecord.sizeBytes = file.size;
    } else {
      audioRecord = this.submissionAudioRepository.create({
        submission,
        exerciseKey,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        data: file.buffer,
      });
    }

    const saved = await this.submissionAudioRepository.save(audioRecord);

    return {
      id: saved.id,
      exerciseKey: saved.exerciseKey,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
    };
  }

  async getSubmissionAudio(
    submissionId: string,
    exerciseKey: string,
    user: any,
  ) {
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
        data: true,
      },
    });

    if (!audio) {
      throw new NotFoundException(`Audio not found for exercise "${exerciseKey}"`);
    }

    return audio;
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

    if (dto.answers !== undefined) {
      submission.reviewedAnswers = dto.answers;
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
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
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
      submission.status = 'submitted';
    } else {
      submission = this.submissionRepository.create({
        assignment,
        lesson: assignment.lesson || null,
        student: { id: studentId } as any,
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
