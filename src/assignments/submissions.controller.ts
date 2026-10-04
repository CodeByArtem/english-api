import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeSubmissionDto } from './dto/assignment.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'))
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async createSubmission(
    @Body() body: CreateSubmissionDto,
    @Request() req: any,
  ) {
    if (req.user.role?.toUpperCase() !== 'STUDENT') {
      throw new UnauthorizedException('Only students can submit assignments');
    }

    return this.assignmentsService.createSubmission(
      body,
      req.user.id,
    );
  }

  @Get('student')
  async getStudentSubmissions(@Request() req: any) {
    return this.assignmentsService.getSubmissionsByStudent(req.user.id);
  }

  @Get('teacher-stats')
  async getTeacherStats(@Request() req: any) {
    const role = req.user.role?.toUpperCase();
    if (!['TUTOR', 'TEACHER', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('Only staff can access stats');
    }
    return this.assignmentsService.getTeacherStats();
  }

  @Get(':id')
  async getSubmission(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.getSubmissionById(id, req.user);
  }

  @Patch(':id/review')
  async reviewSubmission(
    @Param('id') id: string,
    @Body() body: ReviewSubmissionDto,
    @Request() req: any,
  ) {
    const role = req.user.role?.toUpperCase();
    if (!['TUTOR', 'TEACHER', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('Only staff can review submissions');
    }
    return this.assignmentsService.reviewSubmission(id, body);
  }

  @Patch(':id/grade')
  async gradeSubmission(
    @Param('id') id: string,
    @Body() body: GradeSubmissionDto,
    @Request() req: any,
  ) {
    const role = req.user.role?.toUpperCase();
    if (!['TUTOR', 'TEACHER', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('Only staff can grade submissions');
    }
    return this.assignmentsService.gradeSubmission(id, body.grade, body.tutorComment || '');
  }
}
