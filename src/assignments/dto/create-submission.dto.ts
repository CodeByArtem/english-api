import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsOptional()
  assignmentId?: string;

  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsObject()
  @IsNotEmpty()
  answers: Record<string, any>;
}
