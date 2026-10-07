import { Controller, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvitesService } from './invites.service';

@Controller('invites')
@UseGuards(AuthGuard('jwt'))
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async createInvite(@Request() req: any) {
    if (req.user?.role?.toUpperCase() !== 'TUTOR') {
      throw new ForbiddenException('Only tutors can create invites');
    }
    return this.invitesService.createInvite(req.user.id);
  }
}
