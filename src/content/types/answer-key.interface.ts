export type AnswerPrimitive = string | number | boolean;

export interface ExpectedAnswerObject {
  value?: AnswerPrimitive | readonly AnswerPrimitive[];
  expected?: AnswerPrimitive | readonly AnswerPrimitive[];
  answer?: AnswerPrimitive | readonly AnswerPrimitive[];
  isExample?: boolean;
  ignored?: boolean;
  [key: string]: unknown;
}

export type ExpectedAnswer =
  | AnswerPrimitive
  | readonly AnswerPrimitive[]
  | ExpectedAnswerObject;

export type ExerciseAnswerKey = Record<string, ExpectedAnswer>;

export type LessonAnswerKey = Record<string, ExerciseAnswerKey | ExpectedAnswer>;
