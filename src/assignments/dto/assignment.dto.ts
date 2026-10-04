import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsNotEmpty()
  lessonId: string;
}

export class GradeSubmissionDto {
  @IsNotEmpty()
  grade: number;

  @IsString()
  @IsOptional()
  tutorComment?: string;
}
