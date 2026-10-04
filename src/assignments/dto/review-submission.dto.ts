import { IsString, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator';

export class ReviewSubmissionDto {
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  grade?: number;

  @IsString()
  @IsOptional()
  tutorComment?: string;
}
