import { ValidationPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Lesson } from '../content/entities/lesson.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

describe('AssignmentsService - calculateScore & Answer Checking', () => {
  let service: AssignmentsService;

  const mockLessonWithAllExercises: Lesson = {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: '1A Hello',
    order: 1,
    content: '',
    theory: '',
    media_links: [],
    answerKey: {
      exercise_1a_flags: {
        '1': 'Canada',
        '2': 'the UK',
        '3': 'the US',
      },
      exercise_2a_stress: {
        Spain: 'o',
        Poland: 'Oo',
        Japan: 'oO',
      },
      exercise_4a_dialogues: {
        gap_1: 'Mexico',
        gap_2: 'Japan',
      },
      exercise_5_grammar: {
        '1': "I'm",
        '2': "you're",
        '3': "aren't",
      },
      exercise_7a_dialogue: {
        '1': 'Are',
        '2': 'am',
        '3': ["'m", 'am'],
        '4': ["'m", 'am'],
        '5': 'Are',
        '6': ["'m", 'am'],
        '7': 'are',
        '8': ["'m", 'am'],
      },
    },
    unit: null as any,
    exercises: [],
    submissions: [],
    assignments: [],
  };

  const mockLessonOldExercisesOnly: Lesson = {
    id: 'old-lesson-id',
    title: 'Old Lesson',
    order: 1,
    content: '',
    theory: '',
    media_links: [],
    answerKey: {
      exercise_1a_flags: {
        '1': 'Canada',
        '2': 'the UK',
      },
      exercise_2a_stress: {
        Spain: 'o',
        Poland: 'Oo',
      },
      exercise_4a_dialogues: {
        gap_1: 'Mexico',
      },
    },
    unit: null as any,
    exercises: [],
    submissions: [],
    assignments: [],
  };

  beforeEach(() => {
    service = new AssignmentsService(
      {} as any,
      {} as any,
      {} as any,
    );
  });

  describe('normalizeAnswer and matchesAnswer', () => {
    it('should normalize trimmed strings, lowercase, and varied apostrophes', () => {
      expect(service.normalizeAnswer("  I'm  ")).toBe("i'm");
      expect(service.normalizeAnswer('I’m')).toBe("i'm");
      expect(service.normalizeAnswer('YOU’RE')).toBe("you're");
      expect(service.normalizeAnswer("AREN`T")).toBe("aren't");
      expect(service.normalizeAnswer('AREN´T')).toBe("aren't");
      expect(service.normalizeAnswer(null)).toBe('');
      expect(service.normalizeAnswer(undefined)).toBe('');
    });

    it('should match single string expected answer with normalization', () => {
      expect(service.matchesAnswer("I'm", "i'm")).toBe(true);
      expect(service.matchesAnswer(" I’m ", "I'm")).toBe(true);
      expect(service.matchesAnswer("You're", "you’re")).toBe(true);
      expect(service.matchesAnswer("wrong", "right")).toBe(false);
      expect(service.matchesAnswer("", "right")).toBe(false);
    });

    it('should match array expected answers with normalization on both student and expected variants', () => {
      const expectedVariants = ["'m", "am"];
      expect(service.matchesAnswer("'m", expectedVariants)).toBe(true);
      expect(service.matchesAnswer("’m", expectedVariants)).toBe(true);
      expect(service.matchesAnswer("am", expectedVariants)).toBe(true);
      expect(service.matchesAnswer(" AM ", expectedVariants)).toBe(true);
      expect(service.matchesAnswer("are", expectedVariants)).toBe(false);
    });
  });

  describe('Exercise 5: Grammar Short Forms', () => {
    it('should correctly score exercise 5 with standard and curly apostrophes', () => {
      const studentAnswers = {
        grammarInputs: {
          '1': "I'm",
          '2': 'you’re',
          '3': "aren't",
        },
      };

      const result = service.calculateScore(
        {
          id: 'test',
          answerKey: {
            exercise_5_grammar: {
              '1': "I'm",
              '2': "you're",
              '3': "aren't",
            },
          },
        } as Lesson,
        studentAnswers,
      );

      expect(result.details.totalQuestions).toBe(3);
      expect(result.details.correctAnswers).toBe(3);
      expect(result.score).toBe(100);
    });

    it('should handle uppercase, extra whitespace, and incorrect answers in exercise 5', () => {
      const studentAnswers = {
        grammarInputs: {
          '1': "  I'M  ",
          '2': 'YOU ARE', // incorrect short form
          '3': 'AREN’T',
        },
      };

      const result = service.calculateScore(
        {
          id: 'test',
          answerKey: {
            exercise_5_grammar: {
              '1': "I'm",
              '2': "you're",
              '3': "aren't",
            },
          },
        } as Lesson,
        studentAnswers,
      );

      expect(result.details.totalQuestions).toBe(3);
      expect(result.details.correctAnswers).toBe(2);
      expect(result.score).toBe(67);
    });
  });

  describe('Exercise 7a: Dialogue with be (Multiple Variants)', () => {
    it('should accept all acceptable variants for gaps 3, 4, 6, 8', () => {
      // First variant using short form "'m" and "’m"
      const answersVariant1 = {
        dialogue7aInputs: {
          '1': 'Are',
          '2': 'am',
          '3': "'m",
          '4': '’m',
          '5': 'are',
          '6': "'m",
          '7': 'Are',
          '8': '’m',
        },
      };

      const result1 = service.calculateScore(
        {
          id: 'test',
          answerKey: {
            exercise_7a_dialogue: mockLessonWithAllExercises.answerKey.exercise_7a_dialogue,
          },
        } as Lesson,
        answersVariant1,
      );

      expect(result1.details.totalQuestions).toBe(8);
      expect(result1.details.correctAnswers).toBe(8);
      expect(result1.score).toBe(100);

      // Second variant using full form "am"
      const answersVariant2 = {
        dialogue7aInputs: {
          '1': 'are',
          '2': 'AM',
          '3': 'am',
          '4': 'am',
          '5': 'Are',
          '6': 'am',
          '7': 'are',
          '8': 'am',
        },
      };

      const result2 = service.calculateScore(
        {
          id: 'test',
          answerKey: {
            exercise_7a_dialogue: mockLessonWithAllExercises.answerKey.exercise_7a_dialogue,
          },
        } as Lesson,
        answersVariant2,
      );

      expect(result2.details.totalQuestions).toBe(8);
      expect(result2.details.correctAnswers).toBe(8);
      expect(result2.score).toBe(100);
    });
  });

  describe('Exercise 9: Conference card & Non-scoring fields', () => {
    it('should NOT count conferenceCard or Ex 6, 8, 10 into totalQuestions or score', () => {
      const studentAnswers = {
        grammarInputs: {
          '1': "I'm",
          '2': "you're",
          '3': "aren't",
        },
        conferenceCard: {
          name: 'Diego Castillo',
          city: 'Buenos Aires',
          country: 'Argentina',
          roles: ['student', 'manager'],
        },
      };

      const result = service.calculateScore(
        {
          id: 'test',
          answerKey: {
            exercise_5_grammar: {
              '1': "I'm",
              '2': "you're",
              '3': "aren't",
            },
          },
        } as Lesson,
        studentAnswers,
      );

      expect(result.details.totalQuestions).toBe(3);
      expect(result.details.correctAnswers).toBe(3);
      expect(result.score).toBe(100);
    });
  });

  describe('Backwards Compatibility with Existing Lessons and Submissions', () => {
    it('should evaluate existing exercises (1a, 2a, 4a) identically to previous implementation', () => {
      const studentAnswers = {
        flagAnswers: {
          '1': 'Canada',
          '2': 'the UK',
        },
        stressTableInputs: {
          o_1: 'Spain',
          Oo_2: 'Poland',
          my_country: 'Brazil', // should be ignored in stress table matching
        },
        dialogInputs: {
          c1_1: 'Mexico',
        },
      };

      const result = service.calculateScore(mockLessonOldExercisesOnly, studentAnswers);

      expect(result.details.totalQuestions).toBe(5); // 2 flags + 2 stress + 1 dialogue
      expect(result.details.correctAnswers).toBe(5);
      expect(result.score).toBe(100);
    });

    it('should gracefully handle empty answers, missing answers, or missing answerKey', () => {
      expect(service.calculateScore({} as Lesson, {})).toEqual({ score: 0, details: {} });

      const result = service.calculateScore(mockLessonWithAllExercises, {});
      // Total questions across 1a (3) + 2a (3) + 4a (2) + 5 (3) + 7a (8) = 19
      expect(result.details.totalQuestions).toBe(19);
      expect(result.details.correctAnswers).toBe(0);
      expect(result.score).toBe(0);
    });
  });

  describe('ValidationPipe and DTO Integrity', () => {
    it('should preserve new answer fields (grammarInputs, dialogue7aInputs, conferenceCard) through ValidationPipe', async () => {
      const pipe = new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      });

      const rawCreatePayload = {
        lessonId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        answers: {
          flagAnswers: { 1: 'Canada' },
          grammarInputs: { '1': "I'm", '2': "you're", '3': "aren't" },
          dialogue7aInputs: { '1': 'Are', '2': 'am' },
          conferenceCard: {
            name: 'John Doe',
            city: 'London',
            country: 'UK',
            roles: ['student'],
          },
        },
      };

      const transformedCreate: CreateSubmissionDto = await pipe.transform(rawCreatePayload, {
        type: 'body',
        metatype: CreateSubmissionDto,
      });

      expect(transformedCreate.answers.grammarInputs).toBeDefined();
      expect(transformedCreate.answers.dialogue7aInputs).toBeDefined();
      expect(transformedCreate.answers.conferenceCard).toBeDefined();
      expect(transformedCreate.answers.conferenceCard.roles).toEqual(['student']);

      const rawReviewPayload = {
        grade: 95,
        tutorComment: 'Great work!',
        answers: transformedCreate.answers,
      };

      const transformedReview: ReviewSubmissionDto = await pipe.transform(rawReviewPayload, {
        type: 'body',
        metatype: ReviewSubmissionDto,
      });

      expect(transformedReview.answers?.grammarInputs).toBeDefined();
      expect(transformedReview.answers?.conferenceCard).toBeDefined();
    });
  });
});
