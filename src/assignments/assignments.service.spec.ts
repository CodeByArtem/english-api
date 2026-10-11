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

    it('should dynamically score generic lessons with arbitrary answerKey sections', () => {
      const dynamicLesson: Lesson = {
        id: 'dyn-lesson',
        title: 'Dynamic Lesson',
        order: 2,
        content: '',
        theory: '',
        media_links: [],
        answerKey: {
          vocabulary: {
            q1: 'apple',
            q2: 'banana',
          },
          reading: {
            q3: 'London',
          },
        },
        unit: null as any,
        exercises: [],
      } as Lesson;

      const studentAnswers = {
        vocabulary: {
          q1: 'apple',
          q2: 'orange', // incorrect
        },
        reading: {
          q3: 'LONDON',
        },
      };

      const result = service.calculateScore(dynamicLesson, studentAnswers);
      expect(result.details.totalQuestions).toBe(3);
      expect(result.details.correctAnswers).toBe(2);
      expect(result.score).toBe(67);
    });

    it('should dynamically score lessons using exercise entities when answerKey is empty', () => {
      const exerciseLesson: Lesson = {
        id: 'ex-lesson',
        title: 'Exercise Lesson',
        order: 3,
        content: '',
        theory: '',
        media_links: [],
        answerKey: null,
        unit: null as any,
        exercises: [
          {
            id: 'ex-1',
            type: 'multiple_choice',
            order: 1,
            payload: { question: 'Sky color', correctAnswer: 'Blue' },
          },
          {
            id: 'ex-2',
            type: 'text_input',
            order: 2,
            payload: { question: '5 spelled', answer: 'five' },
          },
          {
            id: 'ex-3',
            type: 'fill_in_the_blank',
            order: 3,
            payload: {
              gaps: [
                { id: 'gap_1', answer: 'hello' },
                { id: 'gap_2', answer: 'world' },
              ],
            },
          },
        ],
      } as any;

      const studentAnswers = {
        'ex-1': 'Blue',
        'ex-2': 'FIVE',
        'ex-3': {
          gap_1: 'hello',
          gap_2: 'incorrect',
        },
      };

      const result = service.calculateScore(exerciseLesson, studentAnswers);
      expect(result.details.totalQuestions).toBe(4);
      expect(result.details.correctAnswers).toBe(3);
      expect(result.score).toBe(75);
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

  describe('Homework Lifecycle & Submissions Management', () => {
    let mockSubmissionRepo: any;
    let mockLessonRepo: any;
    let mockAssignmentRepo: any;
    let lifecycleService: AssignmentsService;

    beforeEach(() => {
      mockSubmissionRepo = {
        findOne: jest.fn(),
        create: jest.fn((data) => ({ id: 'new-sub-id', ...data })),
        save: jest.fn(async (data) => ({ ...data, id: data.id || 'saved-sub-id', createdAt: new Date() })),
        remove: jest.fn(async (data) => data),
      };
      mockLessonRepo = {
        findOne: jest.fn(async () => mockLessonWithAllExercises),
      };
      mockAssignmentRepo = {
        findOne: jest.fn(),
      };
      lifecycleService = new AssignmentsService(
        mockAssignmentRepo,
        mockSubmissionRepo,
        mockLessonRepo,
      );
    });

    it('should reject submission if student already has a pending submission', async () => {
      mockSubmissionRepo.findOne.mockResolvedValueOnce({
        id: 'existing-id',
        status: 'submitted',
      });

      await expect(
        lifecycleService.createSubmission(
          { lessonId: mockLessonWithAllExercises.id, answers: {} },
          'student-123',
        ),
      ).rejects.toThrow('You have already submitted this homework. It is currently under review by your teacher.');
    });

    it('should reject submission if homework is already graded', async () => {
      mockSubmissionRepo.findOne.mockResolvedValueOnce({
        id: 'existing-id',
        status: 'graded',
      });

      await expect(
        lifecycleService.createSubmission(
          { lessonId: mockLessonWithAllExercises.id, answers: {} },
          'student-123',
        ),
      ).rejects.toThrow('This homework has already been graded and cannot be resubmitted.');
    });

    it('should update existing submission on needs_revision without creating duplicate', async () => {
      const existing = {
        id: 'existing-sub-id',
        status: 'needs_revision',
        answers: { flagAnswers: { 1: 'Wrong' } },
        score: 0,
      };
      mockSubmissionRepo.findOne.mockResolvedValueOnce(existing);

      const result = await lifecycleService.createSubmission(
        { lessonId: mockLessonWithAllExercises.id, answers: { flagAnswers: { 1: 'Canada' } } },
        'student-123',
      );

      expect(mockSubmissionRepo.create).not.toHaveBeenCalled();
      expect(mockSubmissionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'existing-sub-id',
          status: 'submitted',
        }),
      );
      expect(result.id).toBe('existing-sub-id');
      expect(result.status).toBe('submitted');
    });

    it('should delete submission and return success', async () => {
      const existing = { id: 'sub-to-delete' };
      mockSubmissionRepo.findOne.mockResolvedValueOnce(existing);

      const res = await lifecycleService.deleteSubmission('sub-to-delete');
      expect(mockSubmissionRepo.remove).toHaveBeenCalledWith(existing);
      expect(res).toEqual({ success: true, message: 'Submission deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent submission', async () => {
      mockSubmissionRepo.findOne.mockResolvedValueOnce(null);
      await expect(lifecycleService.deleteSubmission('missing-id')).rejects.toThrow('Submission not found');
    });

    it('should set status to needs_revision when reviewed with revision status', async () => {
      const existing = {
        id: 'sub-review-id',
        status: 'submitted',
      };
      mockSubmissionRepo.findOne.mockResolvedValueOnce(existing);

      const res = await lifecycleService.reviewSubmission('sub-review-id', {
        tutorComment: 'Fix exercise 5',
        status: 'needs_revision',
      });

      expect(mockSubmissionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'needs_revision',
          tutorComment: 'Fix exercise 5',
        }),
      );
      expect(res.status).toBe('needs_revision');
    });

    it('should default to graded status when status is not specified in review', async () => {
      const existing = {
        id: 'sub-review-id',
        status: 'submitted',
      };
      mockSubmissionRepo.findOne.mockResolvedValueOnce(existing);

      const res = await lifecycleService.reviewSubmission('sub-review-id', {
        grade: 100,
        tutorComment: 'Perfect!',
      });

      expect(mockSubmissionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'graded',
          grade: 100,
        }),
      );
      expect(res.status).toBe('graded');
    });
  });

  describe('Lesson 1B Jobs - Dynamic calculateScore', () => {
    const mockLesson1B: Lesson = {
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      title: '1B Jobs',
      order: 2,
      content: '',
      theory: '',
      media_links: [],
      answerKey: {
        exercise_1b_jobs: {
          '1': 'taxi driver',
          '2': 'farmer',
          '3': 'doctor',
          '4': 'football player',
          '5': 'nurse',
          '6': 'school teacher',
        },
        exercise_3_reading: {
          '1': ['b', 'doctor'],
          '2': ['c', 'nurse'],
          '3': ['a', 'office worker'],
        },
      },
      unit: null as any,
      exercises: [],
      submissions: [],
      assignments: [],
    };

    it('should accurately score 100% for full correct answers in Lesson 1B', () => {
      const studentAnswers = {
        exercise_1b_jobs: {
          '1': 'taxi driver',
          '2': 'farmer',
          '3': 'doctor',
          '4': 'football player',
          '5': 'nurse',
          '6': 'school teacher',
        },
        exercise_3_reading: {
          '1': 'b',
          '2': 'c',
          '3': 'a',
        },
      };

      const result = service.calculateScore(mockLesson1B, studentAnswers);
      expect(result.score).toBe(100);
      expect(result.details.totalQuestions).toBe(9);
      expect(result.details.correctAnswers).toBe(9);
    });

    it('should handle partial correct answers, case insensitivity, and alternative letter/text options', () => {
      const studentAnswers = {
        exercise_1b_jobs: {
          '1': 'Taxi Driver ',
          '2': 'FARMER',
          '3': 'wrong_job',
          '4': 'football player',
          '5': 'nurse',
          '6': 'school teacher',
        },
        exercise_3_reading: {
          '1': 'doctor',
          '2': 'c',
          '3': 'wrong',
        },
      };

      const result = service.calculateScore(mockLesson1B, studentAnswers);
      expect(result.details.correctAnswers).toBe(7);
      expect(result.details.totalQuestions).toBe(9);
      expect(result.score).toBe(78);
    });
    it('should accurately score 100% for all exercises in Lesson 1B (Page 8 + Page 9)', () => {
      const mockLesson1BFull: Lesson = {
        ...mockLesson1B,
        answerKey: {
          ...mockLesson1B.answerKey,
          exercise_page9_profiles: {
            lidia: ['pilot', 'a pilot'],
            sakura: ['architect', 'an architect'],
          },
          exercise_4a_reading: {
            '1': ['b', "no, it isn't", 'no'],
            '2': ['a', 'yes, he is', 'yes'],
            '3': ['b', "no, she isn't a doctor. she's an office worker", "no, she isn't"],
          },
          exercise_5a_grammar: {
            '1': ["'s", 'is'],
            '2': ["'s", 'is'],
            '3': ["isn't", 'is not'],
            '4': ["'s", 'is'],
          },
          exercise_6_dialogue: {
            '1': ["'m", "I'm"],
            '2': 'Is it',
            '3': 'it is',
            '4': 'Is the manager',
            '5': "he's",
            '6': ['Is he', "He's"],
            '7': ["he isn't", 'not', "isn't"],
            '8': "'s he",
            '9': "He's",
          },
          exercise_7a_qa: {
            '2': ["No, he isn't. He's a taxi driver", "No, he isn't", 'taxi driver'],
            '3': ["No, she isn't. She's an architect", "No, she isn't", 'architect'],
            '4': ["No, he isn't. He's a doctor", "No, he isn't", 'doctor'],
            '5': ['Yes, he is', 'teacher'],
            '6': ["No, she isn't. She's a nurse", "No, she isn't", 'nurse'],
          },
        },
      };

      const studentAnswers = {
        exercise_1b_jobs: {
          '1': 'taxi driver',
          '2': 'farmer',
          '3': 'doctor',
          '4': 'football player',
          '5': 'nurse',
          '6': 'school teacher',
        },
        exercise_3_reading: {
          '1': 'b',
          '2': 'c',
          '3': 'a',
        },
        exercise_page9_profiles: {
          lidia: 'pilot',
          sakura: 'architect',
        },
        exercise_4a_reading: {
          '1': 'b',
          '2': 'a',
          '3': 'b',
        },
        exercise_5a_grammar: {
          '1': "'s",
          '2': "'s",
          '3': "isn't",
          '4': "'s",
        },
        exercise_6_dialogue: {
          '1': "'m",
          '2': 'Is it',
          '3': 'it is',
          '4': 'Is the manager',
          '5': "he's",
          '6': 'Is he',
          '7': 'he isn\'t',
          '8': "'s he",
          '9': "He's",
        },
        exercise_7a_qa: {
          '2': "No, he isn't. He's a taxi driver.", // with trailing period
          '3': "No, she isn't. She's an architect",
          '4': "No, he isn't. He's a doctor.",
          '5': "Yes, he is.",
          '6': "No, she isn't. She's a nurse",
        },
      };

      const result = service.calculateScore(mockLesson1BFull, studentAnswers);
      expect(result.details.totalQuestions).toBe(32);
      expect(result.details.correctAnswers).toBe(32);
      expect(result.score).toBe(100);
    });
  });
});
