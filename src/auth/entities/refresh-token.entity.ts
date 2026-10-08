import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn('uuid')
  id: string; // jti

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  @Index('IDX_refresh_tokens_user_id')
  userId: string;

  @Column('uuid', { name: 'family_id' })
  @Index('IDX_refresh_tokens_family_id')
  familyId: string;

  @Column({ name: 'token_hash', length: 64, unique: true })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Column('uuid', { name: 'replaced_by_id', nullable: true })
  replacedById: string | null;

  @Column({ name: 'client_type', type: 'varchar', length: 20, nullable: true })
  clientType: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
