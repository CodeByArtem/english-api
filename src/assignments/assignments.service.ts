import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { Lesson } from '../content/entities/lesson.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async createAssignment(
    title: string,
    description: string | null,
    dueDate: Date | null,
    lessonId: string,
  ) {
    const assignment = this.assignmentRepository.create({
      title,
      description,
      dueDate,
      lesson: { id: lessonId } as any,
    });
    return this.assignmentRepository.save(assignment);
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

      if (dto.lessonId && dto.lessonId !== lesson.id) {
        throw new BadRequestException('lessonId does not match assignment lesson');
      }
    } else if (dto.lessonId) {
      lesson = await this.lessonRepository.findOne({
        where: { id: dto.lessonId },
        relations: { exercises: true },
      });
      if (!lesson) throw new NotFoundException('Lesson not found');
    }

    if (!lesson) {
      throw new BadRequestException('Valid lessonId or assignmentId is required');
    }

    console.log('Lesson found:', lesson.id, lesson.title);
    console.log('Lesson answerKey:', lesson.answerKey);

    // Автоматическая проверка ответов
    const { score, details } = this.calculateScore(lesson, dto.answers);

    const submission = this.submissionRepository.create({
      answers: dto.answers,
      assignment,
      lesson,
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
      lesson: savedSubmission.lesson,
      assignment: savedSubmission.assignment,
      createdAt: savedSubmission.createdAt
    };
  }

  private calculateScore(lesson: Lesson, studentAnswers: Record<string, any>) {
    console.log('=== calculateScore START ===');
    console.log('Student answers:', JSON.stringify(studentAnswers, null, 2));
    console.log('Lesson answerKey:', JSON.stringify(lesson.answerKey, null, 2));

    if (!lesson || !lesson.answerKey) {
      console.log('No lesson or answerKey, returning 0');
      return { score: 0, details: {} };
    }

    const answerKey = lesson.answerKey;
    const flagAnswers = studentAnswers.flagAnswers || {};
    const dialogInputs = studentAnswers.dialogInputs || {};
    const stressTableInputs = studentAnswers.stressTableInputs || {};

    console.log('flagAnswers:', flagAnswers);
    console.log('dialogInputs:', dialogInputs);
    console.log('stressTableInputs:', stressTableInputs);

    let totalQuestions = 0;
    let correctAnswers = 0;

    // Exercise 1a: Flags - считаем все вопросы из answerKey
    if (answerKey.exercise_1a_flags) {
      const expectedFlags = answerKey.exercise_1a_flags;
      for (const [flagId, expectedCountry] of Object.entries(expectedFlags)) {
        totalQuestions++;
        const studentAnswer = flagAnswers[flagId];
        const isCorrect = studentAnswer?.trim().toLowerCase() === (expectedCountry as string).trim().toLowerCase();
        console.log(`Flag ${flagId}: student="${studentAnswer}", expected="${expectedCountry}", correct=${isCorrect}`);
        if (isCorrect) {
          correctAnswers++;
        }
      }
    }

    // Exercise 2a: Stress table - считаем все страны из answerKey
    if (answerKey.exercise_2a_stress) {
      const expectedStress = answerKey.exercise_2a_stress;
      for (const [country, expectedPattern] of Object.entries(expectedStress)) {
        totalQuestions++;
        // Ищем ответ студента для этой страны
        let studentPattern = null;
        for (const [key, value] of Object.entries(stressTableInputs)) {
          if (key === 'my_country') continue;
          if (String(value)?.trim().toLowerCase() === country.trim().toLowerCase()) {
            studentPattern = key.replace(/_\d+$/, ''); // Remove _1, _2 suffix
            break;
          }
        }
        const isCorrect = studentPattern?.trim().toLowerCase() === (expectedPattern as string).trim().toLowerCase();
        console.log(`Stress ${country}: student="${studentPattern}", expected="${expectedPattern}", correct=${isCorrect}`);
        if (isCorrect) {
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
        'c2_2': 'gap_4'
      };

      for (const [gapKey, expectedCountry] of Object.entries(expectedDialogues)) {
        totalQuestions++;
        const frontendKey = Object.entries(keyMapping).find(([_, v]) => v === gapKey)?.[0];
        const studentAnswer = frontendKey ? dialogInputs[frontendKey] : null;
        const isCorrect = studentAnswer?.trim().toLowerCase() === (expectedCountry as string).trim().toLowerCase();
        console.log(`Dialogue ${gapKey} (${frontendKey}): student="${studentAnswer}", expected="${expectedCountry}", correct=${isCorrect}`);
        if (isCorrect) {
          correctAnswers++;
        }
      }
    }

    const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    console.log(`=== calculateScore END: ${correctAnswers}/${totalQuestions} = ${finalScore}% ===`);

    const details = {
      totalQuestions,
      correctAnswers,
      gradedAt: new Date().toISOString()
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

  async getSubmissionById(id: string, user: any) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: {
        student: true,
        lesson: {
          exercises: true,
        },
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const role = user.role?.toUpperCase();
    if (role === 'STUDENT' && submission.student.id !== user.id) {
      throw new ForbiddenException('You can only access your own submissions');
    }

    return submission;
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

    submission.status = 'graded';

    return this.submissionRepository.save(submission);
  }
}
