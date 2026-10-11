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

  async findAllForUser(user: any) {
    const assignments = await this.assignmentRepository.find({
      relations: {
        lesson: true,
        submissions: {
          student: true,
        },
      },
      order: {
        dueDate: 'ASC',
      },
    });

    const isStudent = user?.role?.toUpperCase() === 'STUDENT';

    return assignments.map((assignment) => {
      let status: 'pending' | 'submitted' | 'graded' = 'pending';
      let grade: number | null = null;

      if (isStudent && assignment.submissions) {
        const studentSub = assignment.submissions.find(
          (s) => s.student?.id === user.id,
        );
        if (studentSub) {
          status = studentSub.status === 'graded' ? 'graded' : 'submitted';
          grade = studentSub.grade ?? studentSub.score ?? null;
        }
      }

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        lessonId: assignment.lesson?.id,
        status,
        grade,
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
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const isStudent = user?.role?.toUpperCase() === 'STUDENT';
    const studentSub = isStudent
      ? assignment.submissions?.find((s) => s.student?.id === user.id)
      : null;

    const status = studentSub
      ? studentSub.status === 'graded'
        ? 'graded'
        : 'submitted'
      : 'pending';

    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      lessonId: assignment.lesson?.id,
      lesson: assignment.lesson,
      status,
      submission: studentSub
        ? {
            id: studentSub.id,
            content: studentSub.answers ? JSON.stringify(studentSub.answers) : '',
            submittedAt: studentSub.createdAt,
            grade: studentSub.grade ?? studentSub.score ?? undefined,
            feedback: studentSub.tutorComment || undefined,
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

    // Check if student already has a submission for this lesson
    const existingSubmission = await this.submissionRepository.findOne({
      where: {
        student: { id: studentId },
        lesson: { id: lesson.id },
      },
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
        const { score, details } = this.calculateScore(lesson, dto.answers);
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

  public calculateScore(lesson: Lesson, studentAnswers: Record<string, any>) {
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
        totalQuestions++;
        const studentAnswer = flagAnswers[flagId];
        if (this.matchesAnswer(studentAnswer, expectedCountry)) {
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
        let studentPattern: string | null = null;
        for (const [key, value] of Object.entries(stressTableInputs)) {
          if (key === 'my_country') continue;
          if (this.normalizeAnswer(value) === this.normalizeAnswer(country)) {
            studentPattern = key.replace(/_\d+$/, ''); // Remove _1, _2 suffix
            break;
          }
        }
        if (this.matchesAnswer(studentPattern, expectedPattern)) {
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
        totalQuestions++;
        const frontendKey = Object.entries(keyMapping).find(([_, v]) => v === gapKey)?.[0];
        const studentAnswer = frontendKey ? dialogInputs[frontendKey] : null;
        if (this.matchesAnswer(studentAnswer, expectedCountry)) {
          correctAnswers++;
        }
      }
    }

    // Exercise 5: Grammar - Short forms
    if (answerKey.exercise_5_grammar) {
      const expectedGrammar = answerKey.exercise_5_grammar;
      for (const [gapId, expected] of Object.entries(expectedGrammar)) {
        totalQuestions++;
        const studentAnswer = grammarInputs[gapId];
        if (this.matchesAnswer(studentAnswer, expected)) {
          correctAnswers++;
        }
      }
    }

    // Exercise 7a: Dialogue with be
    if (answerKey.exercise_7a_dialogue) {
      const expectedDialogue7a = answerKey.exercise_7a_dialogue;
      for (const [gapId, expected] of Object.entries(expectedDialogue7a)) {
        totalQuestions++;
        const studentAnswer = dialogue7aInputs[gapId];
        if (this.matchesAnswer(studentAnswer, expected)) {
          correctAnswers++;
        }
      }
    }

    // Универсальная динамическая проверка остальных секций в answerKey
    for (const [sectionKey, sectionValue] of Object.entries(answerKey)) {
      if (handledLesson1AKeys.has(sectionKey)) continue;

      if (sectionValue && typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
        const studentSection = answers[sectionKey] || {};
        for (const [qKey, expectedVal] of Object.entries(sectionValue as Record<string, any>)) {
          totalQuestions++;
          const studentVal = studentSection[qKey] ?? answers[qKey];
          if (this.matchesAnswer(studentVal, expectedVal)) {
            correctAnswers++;
          }
        }
      } else {
        totalQuestions++;
        const studentVal = answers[sectionKey];
        if (this.matchesAnswer(studentVal, sectionValue)) {
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

    if (role === 'STUDENT' && submission.lesson) {
      const { answerKey: _answerKey, ...lessonWithoutAnswerKey } = submission.lesson;
      return {
        ...submission,
        lesson: lessonWithoutAnswerKey,
      };
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
