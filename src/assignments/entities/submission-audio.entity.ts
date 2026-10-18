import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('submission_audio')
@Unique('UQ_submission_audio_submission_exercise', ['submission', 'exerciseKey'])
export class SubmissionAudio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Submission, (submission) => submission.audios, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ name: 'exercise_key', type: 'varchar' })
  exerciseKey: string;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'int' })
  sizeBytes: number;

  @Column({ type: 'bytea', select: false })
  data: Buffer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
