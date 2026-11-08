export interface GradingDetails {
  totalQuestions?: number;
  correctAnswers?: number;
  failedQuestions?: string[];
  gradedAt?: string;
  [key: string]: unknown;
}

export interface GradingResult {
  score: number;
  details: GradingDetails;
}

export type SubmissionAnswerPrimitive = string | number | boolean | null;

export type SubmissionAnswerValue =
  | SubmissionAnswerPrimitive
  | readonly SubmissionAnswerPrimitive[]
  | Record<string, unknown>;

export type SubmissionAnswers = Record<string, SubmissionAnswerValue>;

export interface ReviewedAnswerDetail {
  isCorrect?: boolean;
  comment?: string;
  expected?: string | readonly string[];
  studentAnswer?: unknown;
  score?: number;
  [key: string]: unknown;
}

export type ReviewedAnswers = Record<
  string,
  SubmissionAnswerValue | ReviewedAnswerDetail | Record<string, unknown>
>;
