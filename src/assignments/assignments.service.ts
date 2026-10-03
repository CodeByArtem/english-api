import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
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
    return this.assignmentRepository.find({
      where: { lesson: { id: lessonId } as any },
      relations: { submissions: true },
    });
  }

  async createSubmission(
    assignmentId: string,
    studentId: string,
    answers: Record<string, any>,
  ) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const submission = this.submissionRepository.create({
      answers,
      assignment,
      student: { id: studentId } as any,
    });
    return this.submissionRepository.save(submission);
  }

  async gradeSubmission(
    submissionId: string,
    grade: number,
    tutorComment: string,
  ) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: { assignment: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.grade = grade;
    submission.tutorComment = tutorComment;
    submission.status = 'graded';

    return this.submissionRepository.save(submission);
  }
}
