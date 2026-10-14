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
  @IsOptional()
  lessonId?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  studentId?: string;
}

export class SubmitAssignmentTextDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class GradeSubmissionDto {
  @IsNotEmpty()
  grade: number;

  @IsString()
  @IsOptional()
  tutorComment?: string;
}
