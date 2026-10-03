import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { User } from '../users/user.entity';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController, SubmissionsController } from './assignments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Submission, User])],
  controllers: [AssignmentsController, SubmissionsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
