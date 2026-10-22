import {
  ValidationPipe,
  ForbiddenException,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Lesson } from '../content/entities/lesson.entity';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UploadedAudioFile } from './interfaces/audio-file.interface';

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
        Thailand: 'Oo',
        Brazil: 'oO',
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
  };

  beforeEach(() => {
    service = new AssignmentsService(
      {} as any,
      {} as any,
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
        } as unknown as Lesson,
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
        } as unknown as Lesson,
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
            exercise_7a_dialogue: mockLessonWithAllExercises.answerKey!.exercise_7a_dialogue,
          },
        } as unknown as Lesson,
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
            exercise_7a_dialogue: mockLessonWithAllExercises.answerKey!.exercise_7a_dialogue,
          },
        } as unknown as Lesson,
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
        } as unknown as Lesson,
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
      expect(service.calculateScore({} as unknown as Lesson, {})).toEqual({ score: 0, details: {} });

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

    it('should exclude items marked with isExample: true or ignored: true from totalQuestions and score', () => {
      const lessonWithExamples: Lesson = {
        id: 'lesson-with-examples',
        title: 'Lesson with Examples',
        order: 4,
        content: '',
        theory: '',
        media_links: [],
        answerKey: {
          exercise_2a_stress: {
            Poland: { value: 'Oo', isExample: true },
            Japan: { value: 'oO', isExample: true },
            Spain: 'o',
            Brazil: 'oO',
          },
          generic_section: {
            sample_1: { value: 'Sample Answer', ignored: true },
            sample_2: { value: 'Another Sample', isExample: true },
            real_question: { value: 'Real Answer' },
          },
        },
        unit: null as any,
        exercises: [],
      } as Lesson;

      const studentAnswers = {
        stressTableInputs: {
          o_1: 'Spain',
          oO_2: 'Brazil',
        },
        generic_section: {
          real_question: 'real answer',
        },
      };

      const result = service.calculateScore(lessonWithExamples, studentAnswers);
      // exercise_2a_stress: Spain (1) + Brazil (1) = 2 (Poland and Japan ignored)
      // generic_section: real_question (1) = 1 (sample_1 and sample_2 ignored)
      expect(result.details.totalQuestions).toBe(3);
      expect(result.details.correctAnswers).toBe(3);
      expect(result.score).toBe(100);
    });

    it('should ignore metadata keys starting with _ and keys listed in _examples or _ignored', () => {
      const lessonWithListExamples: Lesson = {
        id: 'lesson-list-examples',
        title: 'Lesson with List Examples',
        order: 5,
        content: '',
        theory: '',
        media_links: [],
        answerKey: {
          exercise_2a_stress: {
            _examples: ['Poland', 'Japan'],
            Poland: 'Oo',
            Japan: 'oO',
            Spain: 'o',
            Brazil: 'oO',
          },
          _metadata: {
            version: 1,
            author: 'Admin',
          },
        },
        unit: null as any,
        exercises: [],
      } as Lesson;

      const studentAnswers = {
        stressTableInputs: {
          o_1: 'Spain',
          oO_2: 'Brazil',
        },
      };

      const result = service.calculateScore(lessonWithListExamples, studentAnswers);
      expect(result.details.totalQuestions).toBe(2);
      expect(result.details.correctAnswers).toBe(2);
      expect(result.score).toBe(100);
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

      const rawRevisionPayload = {
        grade: null,
        tutorComment: 'Please revise exercise 1',
        status: 'needs_revision',
        reviewedAnswers: transformedCreate.answers,
      };

      const transformedRevision: ReviewSubmissionDto = await pipe.transform(rawRevisionPayload, {
        type: 'body',
        metatype: ReviewSubmissionDto,
      });

      expect(transformedRevision.status).toBe('needs_revision');
      expect(transformedRevision.tutorComment).toBe('Please revise exercise 1');
      expect(transformedRevision.reviewedAnswers?.grammarInputs).toBeDefined();
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
      const mockUserRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
      };
      lifecycleService = new AssignmentsService(
        mockAssignmentRepo,
        mockSubmissionRepo,
        mockLessonRepo,
        mockUserRepo as any,
        {} as any,
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
        reviewedAnswers: { flagAnswers: { 1: 'Spain' } },
      });

      expect(mockSubmissionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'needs_revision',
          tutorComment: 'Fix exercise 5',
          reviewedAnswers: { flagAnswers: { 1: 'Spain' } },
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
            '2': [
              "No, he isn't. He's a football player",
              "No, he isn't. He is football player",
              "No, he isn't. He is a football player",
              "No, he's a football player",
              "No, he isn't",
              'football player',
              "He's a football player",
              'He is football player',
              'He is a football player',
              'a football player',
              'No, he is not',
            ],
            '3': [
              "No, she isn't. She's an architect",
              "No, she isn't. She is architect",
              "No, she isn't. She is an architect",
              "No, she's an architect",
              "No, she isn't",
              'architect',
              "She's an architect",
              'She is architect',
              'She is an architect',
              'an architect',
              'No, she is not',
            ],
            '4': [
              "No, he isn't. He's a nurse",
              "No, he isn't. He is nurse",
              "No, he isn't. He is a nurse",
              "No, he's a nurse",
              "No, he isn't",
              'nurse',
              "He's a nurse",
              'He is nurse',
              'He is a nurse',
              'a nurse',
              'No, he is not',
              'Yes, he is',
              'Yes he is',
            ],
            '5': [
              "No, he isn't. He's a taxi driver",
              "No, he isn't. He is taxi driver",
              "No, he isn't. He is a taxi driver",
              "No, he's a taxi driver",
              "No, he isn't",
              'taxi driver',
              "He's a taxi driver",
              'He is taxi driver',
              'He is a taxi driver',
              'a taxi driver',
              'No, he is not',
              'Yes, he is',
              'Yes he is',
            ],
            '6': [
              'Yes, she is',
              'Yes she is',
              "She's a doctor",
              'She is doctor',
              'She is a doctor',
              'doctor',
              'a doctor',
              "Yes, she's a doctor",
            ],
          },
      },
    };

    it('should accurately score 100% for all exercises in Lesson 1B (Page 8 + Page 9)', () => {
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
          '2': "No, he isn't. He's a football player.", // with trailing period
          '3': "No, she isn't. She's an architect",
          '4': "No, he isn't. He's a nurse.",
          '5': "No, he isn't. He's a taxi driver.",
          '6': "Yes, she is.",
        },
      };

      const result = service.calculateScore(mockLesson1BFull, studentAnswers);
      expect(result.details.totalQuestions).toBe(32);
      expect(result.details.correctAnswers).toBe(32);
      expect(result.score).toBe(100);
    });

    it('should match student answers in 7a with missing commas, contractions, and articles', () => {
      const studentAnswers = {
        exercise_7a_qa: {
          '2': "No he isn't. He is football player",
          '3': "No she isn't. She is architect",
          '4': "Yes he is",
          '5': "No he isn't. He is taxi driver",
          '6': "Yes she is",
        },
      };

      const mock7aOnly: Lesson = {
        id: 'mock-7a',
        answerKey: {
          exercise_7a_qa: mockLesson1BFull.answerKey!.exercise_7a_qa,
        },
      } as unknown as Lesson;

      const result = service.calculateScore(mock7aOnly, studentAnswers);
      expect(result.details.correctAnswers).toBe(5);
      expect(result.details.totalQuestions).toBe(5);
      expect(result.score).toBe(100);
    });
  });

  describe('Lesson 1C Nationalities - Dynamic calculateScore', () => {
    const mockLesson1CFull: any = {
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      title: '1C Nationalities',
      order: 3,
      answerKey: {
        exercise_1b_nationalities: {
          '1': ['d', 'Spanish'],
          '2': ['j', 'Canadian'],
          '3': ['g', 'Japanese'],
          '4': ['i', 'American'],
          '5': ['c', 'Polish'],
          '6': ['l', 'Argentinian'],
          '7': ['a', 'Thai'],
          '8': ['b', 'British'],
          '9': ['e', 'Turkish'],
          '10': ['f', 'Mexican'],
          '11': ['k', 'Brazilian'],
          '12': ['h', 'Italian'],
        },
        exercise_2c_stress: {
          '2': ['D', 'Different', 'd'],
          '3': ['D', 'Different', 'd'],
          '4': ['S', 'Same', 's'],
          '5': ['S', 'Same', 's'],
        },
        exercise_4a_photos: {
          '1': ['D', 'd'],
          '2': ['B', 'b'],
          '3': ['C', 'c', 'A', 'a'],
          '4': ['A', 'a', 'C', 'c'],
          '5': ['E', 'e'],
        },
        exercise_4b_tf: {
          '2': ['F', 'False', 'f'],
          '3': ['T', 'True', 't'],
          '4': ['F', 'False', 'f'],
          '5': ['F', 'False', 'f'],
        },
        exercise_5a_grammar: {
          '1': ["aren't", 'are not', 'arent'],
          '2': ['are'],
          '3': ['Are', 'are'],
          '4': ["aren't", 'are not', 'arent'],
          '5': ['are'],
        },
        exercise_6_texts: {
          '2': ["'re", 'are'],
          '3': ["aren't", 'are not', 'arent'],
          '4': ["'re", 'are'],
          '5': ["'re", 'are'],
          '7': ["aren't", 'are not', 'arent'],
          '8': ["'re", 'are'],
          '9': ['are', "'re"],
          '10': ['are', "'re"],
        },
        exercise_7a_questions: {
          '2': ['Are the teachers at your school American?'],
          '3': ['Are your classmates from different countries?'],
          '4': ['Where are you and your classmates now?'],
          '5': ['Who are your teachers?'],
          '6': ['Where are your teachers from?'],
        },
      },
    };

    it('should score 100% for full correct answers in Lesson 1C', () => {
      const studentAnswers = {
        exercise_1b_nationalities: {
          '1': 'd',
          '2': 'Canadian',
          '3': 'g',
          '4': 'American',
          '5': 'c',
          '6': 'Argentinian',
          '7': 'Thai',
          '8': 'British',
          '9': 'e',
          '10': 'Mexican',
          '11': 'k',
          '12': 'Italian',
        },
        exercise_2c_stress: {
          '2': 'D',
          '3': 'd',
          '4': 'S',
          '5': 'Same',
        },
        exercise_4a_photos: {
          '1': 'D',
          '2': 'B',
          '3': 'C',
          '4': 'A',
          '5': 'E',
        },
        exercise_4b_tf: {
          '2': 'F',
          '3': 'T',
          '4': 'False',
          '5': 'f',
        },
        exercise_5a_grammar: {
          '1': "aren't",
          '2': 'are',
          '3': 'Are',
          '4': "aren't",
          '5': 'are',
        },
        exercise_6_texts: {
          '2': "'re",
          '3': "aren't",
          '4': "'re",
          '5': 'are',
          '7': "aren't",
          '8': "'re",
          '9': 'are',
          '10': "'re",
        },
        exercise_7a_questions: {
          '2': 'Are the teachers at your school American?',
          '3': 'Are your classmates from different countries?',
          '4': 'Where are you and your classmates now?',
          '5': 'Who are your teachers?',
          '6': 'Where are your teachers from?',
        },
      };

      const result = service.calculateScore(mockLesson1CFull, studentAnswers);
      expect((result.details as any)?.totalQuestions).toBe(43);
      expect((result.details as any)?.correctAnswers).toBe(43);
      expect(result.score).toBe(100);
    });
  });

  describe('assertCanAccessSubmission', () => {
    const mockSubmission = {
      id: 'sub-123',
      student: { id: 'student-1', email: 'student1@example.com' },
    } as Submission;

    it('should allow student to access their own submission', () => {
      const user = { id: 'student-1', role: 'STUDENT' };
      expect(() => service.assertCanAccessSubmission(user, mockSubmission)).not.toThrow();
    });

    it('should throw ForbiddenException if student tries to access another student submission', () => {
      const user = { id: 'student-2', role: 'STUDENT' };
      expect(() => service.assertCanAccessSubmission(user, mockSubmission)).toThrow(ForbiddenException);
    });

    it('should allow tutor to access any student submission', () => {
      const tutor = { id: 'tutor-1', role: 'TUTOR' };
      expect(() => service.assertCanAccessSubmission(tutor, mockSubmission)).not.toThrow();
    });
  });

  describe('SubmissionAudio - upload, access control & data exclusion', () => {
    let audioService: AssignmentsService;
    let mockSubmissionRepo: any;
    let mockAudioRepo: any;

    const mockSubmission: Submission = {
      id: 'sub-abc',
      student: { id: 'student-owner' } as any,
      answers: {},
      status: 'submitted',
      grade: null,
      score: null,
      details: null,
      reviewedAnswers: null,
      tutorComment: null,
      createdAt: new Date(),
      assignment: null,
      lesson: null,
      audios: [],
    };

    beforeEach(() => {
      mockSubmissionRepo = {
        findOne: jest.fn(async () => mockSubmission),
        find: jest.fn(async () => [mockSubmission]),
      };
      mockAudioRepo = {
        findOne: jest.fn(),
        create: jest.fn((dto) => ({ id: 'audio-id-1', ...dto })),
        save: jest.fn(async (entity) => ({ id: 'audio-id-1', ...entity })),
      };

      audioService = new AssignmentsService(
        {} as any,
        mockSubmissionRepo,
        {} as any,
        {} as any,
        mockAudioRepo,
      );
    });

    it('should reject audio upload if user is a TUTOR (only students can upload)', async () => {
      const tutorUser = { id: 'tutor-1', role: 'TUTOR' };
      const file: UploadedAudioFile = {
        fieldname: 'file',
        originalname: 'test.webm',
        encoding: '7bit',
        mimetype: 'audio/webm',
        size: 1024,
        buffer: Buffer.from('test audio'),
      };

      await expect(
        audioService.saveSubmissionAudio('sub-abc', 'ex_1', file, tutorUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject audio upload if mimeType is not in whitelist', async () => {
      const studentUser = { id: 'student-owner', role: 'STUDENT' };
      const invalidFile: UploadedAudioFile = {
        fieldname: 'file',
        originalname: 'test.wav',
        encoding: '7bit',
        mimetype: 'audio/wav',
        size: 1024,
        buffer: Buffer.from('wav data'),
      };

      await expect(
        audioService.saveSubmissionAudio('sub-abc', 'ex_1', invalidFile, studentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept valid mimeType with codec parameters (audio/webm;codecs=opus)', async () => {
      const studentUser = { id: 'student-owner', role: 'STUDENT' };
      const fileWithParams: UploadedAudioFile = {
        fieldname: 'file',
        originalname: 'test.webm',
        encoding: '7bit',
        mimetype: 'audio/webm;codecs=opus',
        size: 2048,
        buffer: Buffer.from('webm opus data'),
      };

      const result = await audioService.saveSubmissionAudio('sub-abc', 'ex_1', fileWithParams, studentUser);
      expect(result.exerciseKey).toBe('ex_1');
      expect(result.sizeBytes).toBe(2048);
      expect(mockAudioRepo.save).toHaveBeenCalled();
    });

    it('should reject file exceeding 1.5 MB limit with PayloadTooLargeException (HTTP 413)', async () => {
      const studentUser = { id: 'student-owner', role: 'STUDENT' };
      const largeFile: UploadedAudioFile = {
        fieldname: 'file',
        originalname: 'large.webm',
        encoding: '7bit',
        mimetype: 'audio/webm',
        size: 1.6 * 1024 * 1024,
        buffer: Buffer.alloc(1.6 * 1024 * 1024),
      };

      await expect(
        audioService.saveSubmissionAudio('sub-abc', 'ex_1', largeFile, studentUser),
      ).rejects.toThrow(PayloadTooLargeException);
    });

    it('should replace existing record when re-uploading with the same exerciseKey', async () => {
      const studentUser = { id: 'student-owner', role: 'STUDENT' };
      const existingAudio = {
        id: 'existing-audio-id',
        exerciseKey: 'ex_1',
        mimeType: 'audio/ogg',
        sizeBytes: 500,
        data: Buffer.from('old data'),
      };
      mockAudioRepo.findOne.mockResolvedValueOnce(existingAudio);

      const newFile: UploadedAudioFile = {
        fieldname: 'file',
        originalname: 'new.webm',
        encoding: '7bit',
        mimetype: 'audio/webm',
        size: 1200,
        buffer: Buffer.from('new data'),
      };

      const result = await audioService.saveSubmissionAudio('sub-abc', 'ex_1', newFile, studentUser);
      expect(result.exerciseKey).toBe('ex_1');
      expect(result.sizeBytes).toBe(1200);
      expect(existingAudio.sizeBytes).toBe(1200);
      expect(existingAudio.mimeType).toBe('audio/webm');
      expect(existingAudio.data).toEqual(Buffer.from('new data'));
    });

    it('should return metadata list in getSubmissionById without binary data', async () => {
      const submissionWithAudios = {
        ...mockSubmission,
        audios: [
          {
            id: 'aud-1',
            exerciseKey: 'ex_8b',
            mimeType: 'audio/webm',
            sizeBytes: 15000,
          },
        ],
      };
      mockSubmissionRepo.findOne.mockResolvedValueOnce(submissionWithAudios);

      const tutorUser = { id: 'tutor-1', role: 'TUTOR' };
      const res = await audioService.getSubmissionById('sub-abc', tutorUser);

      expect(res.audios).toEqual([
        { exerciseKey: 'ex_8b', mimeType: 'audio/webm', sizeBytes: 15000 },
      ]);
      expect((res.audios[0] as any).data).toBeUndefined();
    });

    it('should fall back gracefully without failing if audios relation query throws an error', async () => {
      mockSubmissionRepo.findOne
        .mockRejectedValueOnce(new Error('relation "submission_audio" does not exist'))
        .mockResolvedValueOnce({
          ...mockSubmission,
          audios: undefined,
        });

      const tutorUser = { id: 'tutor-1', role: 'TUTOR' };
      const res = await audioService.getSubmissionById('sub-abc', tutorUser);

      expect(res.id).toBe('sub-abc');
      expect(res.audios).toEqual([]);
      expect(mockSubmissionRepo.findOne).toHaveBeenCalledTimes(2);
    });

    it('should verify teacher-stats and student lists do not include audio data', async () => {
      mockSubmissionRepo.find.mockResolvedValueOnce([
        {
          id: 'sub-abc',
          score: 100,
          status: 'submitted',
          answers: {},
          reviewedAnswers: null,
          details: null,
          tutorComment: null,
        },
      ]);

      const stats = await audioService.getTeacherStats();
      expect(stats[0]).not.toHaveProperty('audios');
      expect(stats[0]).not.toHaveProperty('data');
    });
  });
});
