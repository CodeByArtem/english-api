export interface MultipleChoicePayload {
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string | string[];
}

export interface FillInBlankGap {
  id: string;
  answer: string | string[];
  options?: string[];
}

export interface FillInBlankPayload {
  text?: string;
  gaps?: FillInBlankGap[];
}

export interface TextInputPayload {
  question?: string;
  text?: string;
  answer?: string | string[];
  placeholder?: string;
}

export interface MatchPair {
  id: number | string;
  left: string;
  right: string;
}

export interface MatchPayload {
  pairs?: MatchPair[];
}

export type ExercisePayload =
  | MultipleChoicePayload
  | FillInBlankPayload
  | TextInputPayload
  | MatchPayload
  | Record<string, unknown>;
