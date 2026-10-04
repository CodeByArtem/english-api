import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateAssignmentDto, GradeSubmissionDto } from './dto/assignment.dto';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('teacher-stats')
  async getTeacherStats(@Request() req: any) {
    if (req.user.role?.toUpperCase() !== 'TUTOR') {
      throw new UnauthorizedException('Only tutors can view statistics');
    }
    return this.assignmentsService.getTeacherStats();
  }

  @Post()
  async createAssignment(
    @Body() body: CreateAssignmentDto,
    @Request() req: any,
  ) {
    if (req.user.role?.toUpperCase() !== 'TUTOR') {
      throw new UnauthorizedException('Only tutors can create assignments');
    }
    return this.assignmentsService.createAssignment(
      body.title,
      body.description || null,
      body.dueDate ? new Date(body.dueDate) : null,
      body.lessonId,
    );
  }

  @Get('lesson/:lessonId')
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.assignmentsService.findByLessonId(lessonId);
  }
}
