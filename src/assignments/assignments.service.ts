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
    
    // Возвращаем с нужными связями
    return this.submissionRepository.findOne({
      where: { id: savedSubmission.id },
      relations: { lesson: true, assignment: true },
    });
  }

  private calculateScore(lesson: Lesson, studentAnswers: Record<string, any>) {
    if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
      return { score: 0, details: {} };
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const details: Record<string, any> = {};

    // Картографируем ответы для удобства поиска
    // Урок "1A Hello" использует flagAnswers, dialogInputs, stressTableInputs
    const flagAnswers = studentAnswers.flagAnswers || {};
    const dialogInputs = studentAnswers.dialogInputs || {};
    const stressTableInputs = studentAnswers.stressTableInputs || {};

    const normalizedAnswers = {
      ...studentAnswers,
      ...flagAnswers,
      ...dialogInputs,
      ...stressTableInputs,
    };

    for (const exercise of lesson.exercises) {
      const exerciseId = exercise.id;
      const type = exercise.type;
      const payload = exercise.payload;
      let exerciseScore = 0;
      let exerciseMaxPoints = 0;
      const exerciseDetails: {
        correct: boolean;
        details: any[];
      } = {
        correct: false,
        details: [],
      };

      if (type === 'match') {
        const pairs = payload.pairs || [];
        exerciseMaxPoints = pairs.length;
        pairs.forEach((pair: any) => {
          // Для флагов ключи числовые (ID флага)
          const studentAnswer = normalizedAnswers[pair.id] || normalizedAnswers[pair.left] || normalizedAnswers[`match_${pair.id}`];
          if (studentAnswer === pair.right) {
            exerciseScore++;
            exerciseDetails.details.push({ item: pair.left, status: 'correct' });
          } else {
            exerciseDetails.details.push({ 
              item: pair.left, 
              status: 'incorrect', 
              expected: pair.right, 
              actual: studentAnswer 
            });
          }
        });
      } else if (type === 'fill_in_the_blank') {
        const gaps = payload.gaps || [];
        exerciseMaxPoints = gaps.length;
        gaps.forEach((gap: any) => {
          // Ключи могут быть c1_1, gap_1 и т.д.
          const studentAnswer = normalizedAnswers[gap.id] || normalizedAnswers[gap.id.replace('gap_', 'c1_')]; 
          if (studentAnswer?.toLowerCase().trim() === gap.answer.toLowerCase().trim()) {
            exerciseScore++;
            exerciseDetails.details.push({ gap: gap.id, status: 'correct' });
          } else {
            exerciseDetails.details.push({ 
              gap: gap.id, 
              status: 'incorrect', 
              expected: gap.answer, 
              actual: studentAnswer 
            });
          }
        });
      } else if (type === 'stress_table') {
        // Добавляем поддержку stress_table
        const items = payload.items || [];
        exerciseMaxPoints = items.length;
        items.forEach((item: any) => {
          const studentAnswer = normalizedAnswers[item.id];
          if (studentAnswer === item.correctCategory) {
            exerciseScore++;
            exerciseDetails.details.push({ item: item.text, status: 'correct' });
          } else {
            exerciseDetails.details.push({ 
              item: item.text, 
              status: 'incorrect', 
              expected: item.correctCategory, 
              actual: studentAnswer 
            });
          }
        });
      } else if (type === 'multiple_choice') {
        exerciseMaxPoints = 1;
        const studentAnswer = normalizedAnswers[exerciseId] || normalizedAnswers[`choice_${exerciseId}`];
        if (studentAnswer === payload.correctAnswer) {
          exerciseScore = 1;
          exerciseDetails.details.push({ status: 'correct' });
        } else {
          exerciseDetails.details.push({ 
            status: 'incorrect', 
            expected: payload.correctAnswer, 
            actual: studentAnswer 
          });
        }
      } else if (type === 'text_input') {
        exerciseMaxPoints = 1;
        const studentAnswer = normalizedAnswers[exerciseId] || normalizedAnswers[`input_${exerciseId}`];
        if (studentAnswer?.toLowerCase().trim() === payload.answer.toLowerCase().trim()) {
          exerciseScore = 1;
          exerciseDetails.details.push({ status: 'correct' });
        } else {
          exerciseDetails.details.push({ 
            status: 'incorrect', 
            expected: payload.answer, 
            actual: studentAnswer 
          });
        }
      }

      exerciseDetails.correct = exerciseScore === exerciseMaxPoints && exerciseMaxPoints > 0;
      details[exerciseId] = exerciseDetails;
      earnedPoints += exerciseScore;
      totalPoints += exerciseMaxPoints;
    }

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
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
