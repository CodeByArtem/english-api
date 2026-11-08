import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../../users/user.entity';
import { Lesson } from '../../content/entities/lesson.entity';
import { SubmissionAudio } from './submission-audio.entity';
import type {
  GradingDetails,
  SubmissionAnswers,
  ReviewedAnswers,
} from '../types/submission.types';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  answers: SubmissionAnswers;

  @Column({
    type: 'varchar',
    default: 'submitted',
  })
  status: string;

  @Column({ type: 'int', nullable: true })
  grade: number | null;

  @Column({ type: 'int', nullable: true })
  score: number | null;

  @Column({ type: 'jsonb', nullable: true })
  details: GradingDetails | null;

  @Column({ type: 'jsonb', nullable: true })
  reviewedAnswers: ReviewedAnswers | null;

  @Column({ type: 'text', nullable: true })
  tutorComment: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Assignment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment | null;

  @ManyToOne(() => Lesson, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @OneToMany(() => SubmissionAudio, (audio) => audio.submission)
  audios: SubmissionAudio[];
}
