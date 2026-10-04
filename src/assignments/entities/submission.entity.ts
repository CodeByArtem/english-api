import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../../users/user.entity';
import { Lesson } from '../../content/entities/lesson.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  answers: Record<string, any>;

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
  details: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  reviewedAnswers: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  tutorComment: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Assignment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment | null;

  @ManyToOne(() => Lesson, { nullable: false })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
