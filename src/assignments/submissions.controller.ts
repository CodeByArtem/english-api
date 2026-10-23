import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/role.enum';
import { AssignmentsService } from './assignments.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeSubmissionDto } from './dto/assignment.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { MulterExceptionFilter } from './filters/multer-exception.filter';
import type { UploadedAudioFile } from './interfaces/audio-file.interface';

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
  async getTeacherStats(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.assignmentsService.getTeacherStats(parsedLimit);
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

  @Post(':id/audio/:exerciseKey')
  @Roles(Role.STUDENT)
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1.5 * 1024 * 1024,
      },
    }),
  )
  async uploadAudio(
    @Param('id') id: string,
    @Param('exerciseKey') exerciseKey: string,
    @UploadedFile() file: UploadedAudioFile,
    @Request() req: any,
  ) {
    return this.assignmentsService.saveSubmissionAudio(
      id,
      exerciseKey,
      file,
      req.user,
    );
  }

  @Get(':id/audio/:exerciseKey')
  async getAudio(
    @Param('id') id: string,
    @Param('exerciseKey') exerciseKey: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const audio = await this.assignmentsService.getSubmissionAudio(
      id,
      exerciseKey,
      req.user,
    );

    res.setHeader('Content-Type', audio.mimeType);
    res.setHeader('Content-Length', audio.data.length);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');

    return res.end(audio.data);
  }
}
