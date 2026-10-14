import {
  Controller,
  Post,
  Get,
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
import {
  CreateAssignmentDto,
  SubmitAssignmentTextDto,
} from './dto/assignment.dto';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('students')
  @Roles(Role.TUTOR)
  async getStudents() {
    return this.assignmentsService.getStudentsList();
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.assignmentsService.findAllForUser(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.findOneForUser(id, req.user);
  }

  @Post()
  @Roles(Role.TUTOR)
  async createAssignment(
    @Body() body: CreateAssignmentDto,
    @Request() req: any,
  ) {
    return this.assignmentsService.createAssignment(
      body.title,
      body.description || null,
      body.dueDate ? new Date(body.dueDate) : null,
      body.attachmentUrl || null,
      body.studentId || null,
      req.user.id,
      body.lessonId || null,
    );
  }

  @Post(':id/submit')
  @Roles(Role.STUDENT)
  async submitAssignment(
    @Param('id') id: string,
    @Body() body: SubmitAssignmentTextDto,
    @Request() req: any,
  ) {
    return this.assignmentsService.submitTextAssignment(
      id,
      req.user.id,
      body.content,
    );
  }

  @Delete(':id')
  @Roles(Role.TUTOR)
  async deleteAssignment(@Param('id') id: string) {
    return this.assignmentsService.deleteAssignment(id);
  }

  @Get('lesson/:lessonId')
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.assignmentsService.findByLessonId(lessonId);
  }
}
