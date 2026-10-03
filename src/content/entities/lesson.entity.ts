import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Unit } from './unit.entity';
import { Exercise } from './exercise.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => Unit, (unit) => unit.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(() => Exercise, (exercise) => exercise.lesson, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  exercises: Exercise[];
}
