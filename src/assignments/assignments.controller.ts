import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async createAssignment(
    @Body() body: { title: string; description?: string; dueDate?: Date; lessonId: string },
    @Request() req: any,
  ) {
    if (req.user.role !== 'TUTOR') {
      throw new Error('Only tutors can create assignments');
    }
    return this.assignmentsService.createAssignment(
      body.title,
      body.description || null,
      body.dueDate || null,
      body.lessonId,
    );
  }

  @Get('lesson/:lessonId')
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.assignmentsService.findByLessonId(lessonId);
  }
}

@Controller('submissions')
@UseGuards(AuthGuard('jwt'))
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async createSubmission(
    @Body() body: { assignmentId: string; answers: Record<string, any> },
    @Request() req: any,
  ) {
    if (req.user.role !== 'STUDENT') {
      throw new Error('Only students can submit assignments');
    }
    return this.assignmentsService.createSubmission(
      body.assignmentId,
      req.user.id,
      body.answers,
    );
  }

  @Patch(':id/grade')
  async gradeSubmission(
    @Param('id') id: string,
    @Body() body: { grade: number; tutorComment: string },
    @Request() req: any,
  ) {
    if (req.user.role !== 'TUTOR') {
      throw new Error('Only tutors can grade submissions');
    }
    return this.assignmentsService.gradeSubmission(id, body.grade, body.tutorComment);
  }
}
