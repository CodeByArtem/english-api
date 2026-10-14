import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/role.enum';
import { AssignmentsService } from './assignments.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeSubmissionDto } from './dto/assignment.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.STUDENT)
  async createSubmission(
    @Body() body: CreateSubmissionDto,
    @Request() req: any,
  ) {
    return this.assignmentsService.createSubmission(body, req.user.id);
  }

  @Get('student')
  async getStudentSubmissions(@Request() req: any) {
    return this.assignmentsService.getSubmissionsByStudent(req.user.id);
  }

  @Get('lesson/:lessonId/my-submission')
  async getMySubmissionForLesson(
    @Param('lessonId') lessonId: string,
    @Request() req: any,
  ) {
    return this.assignmentsService.getStudentSubmissionForLesson(
      req.user.id,
      lessonId,
    );
  }

  @Get('teacher-stats')
  @Roles(Role.TUTOR)
  async getTeacherStats() {
    return this.assignmentsService.getTeacherStats();
  }

  @Get(':id')
  async getSubmission(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.getSubmissionById(id, req.user);
  }

  @Patch(':id/review')
  @Roles(Role.TUTOR)
  async reviewSubmission(
    @Param('id') id: string,
    @Body() body: ReviewSubmissionDto,
  ) {
    return this.assignmentsService.reviewSubmission(id, body);
  }

  @Patch(':id/grade')
  @Roles(Role.TUTOR)
  async gradeSubmission(
    @Param('id') id: string,
    @Body() body: GradeSubmissionDto,
  ) {
    return this.assignmentsService.gradeSubmission(
      id,
      body.grade,
      body.tutorComment || '',
    );
  }

  @Delete(':id')
  @Roles(Role.TUTOR)
  async deleteSubmission(@Param('id') id: string) {
    return this.assignmentsService.deleteSubmission(id);
  }
}
