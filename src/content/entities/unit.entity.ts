import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Textbook } from './textbook.entity';
import { Lesson } from './lesson.entity';
import { Material } from './material.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => Textbook, (textbook) => textbook.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'textbook_id' })
  textbook: Textbook;

  @OneToMany(() => Lesson, (lesson) => lesson.unit, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  lessons: Lesson[];

  @OneToMany(() => Material, (material) => material.unit, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  materials: Material[];
}
