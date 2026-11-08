import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import type { SubmissionAnswers } from '../types/submission.types';

export class CreateSubmissionDto {
  @IsString()
  @IsOptional()
  assignmentId?: string;

  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsObject()
  @IsNotEmpty()
  answers: SubmissionAnswers;
}
