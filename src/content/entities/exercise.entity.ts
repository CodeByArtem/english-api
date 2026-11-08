import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import type { ExercisePayload } from '../types/exercise-payload.interface';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column()
  type: string;

  @Column({ type: 'jsonb' })
  payload: ExercisePayload;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
