import { IsString, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator';
import type { SubmissionAnswers, ReviewedAnswers } from '../types/submission.types';

export class ReviewSubmissionDto {
  @IsObject()
  @IsOptional()
  answers?: SubmissionAnswers;

  @IsObject()
  @IsOptional()
  reviewedAnswers?: ReviewedAnswers;

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
