import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity('textbooks')
export class Textbook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  level: string;

  @OneToMany(() => Unit, (unit) => unit.textbook, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  units: Unit[];
}
