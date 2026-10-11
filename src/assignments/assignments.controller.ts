import { Controller, Post, Get, Param, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/assignment.dto';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.assignmentsService.findAllForUser(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.findOneForUser(id, req.user);
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
