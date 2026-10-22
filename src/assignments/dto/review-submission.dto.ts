import { IsString, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator';

export class ReviewSubmissionDto {
  @IsObject()
  @IsOptional()
  answers?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  reviewedAnswers?: Record<string, unknown>;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  grade?: number | null;

  @IsString()
  @IsOptional()
  tutorComment?: string | null;

  @IsString()
  @IsOptional()
  status?: string;
}
