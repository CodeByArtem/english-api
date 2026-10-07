import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Invite } from './invite.entity';
import { Role } from '../common/role.enum';
import { User } from '../users/user.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  async createInvite(creatorId: string): Promise<{ inviteCode: string; expiresAt: Date }> {
    const rawCode = crypto.randomBytes(32).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(rawCode).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = this.inviteRepository.create({
      tokenHash,
      role: Role.TUTOR,
      expiresAt,
      usedAt: null,
      createdBy: { id: creatorId } as User,
    });
    await this.inviteRepository.save(invite);

    return { inviteCode: rawCode, expiresAt };
  }
}
