import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Textbook } from './entities/textbook.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { Material } from './entities/material.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Textbook)
    private readonly textbookRepository: Repository<Textbook>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
    const existingTextbook = await this.textbookRepository.findOne({
      where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    });

    console.log('Starting database seeding...');

    let textbook = existingTextbook;
    if (!textbook) {
      textbook = this.textbookRepository.create({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        title: 'Roadmap A1: Beginner English',
        description:
          'A comprehensive beginner English course covering basic grammar, vocabulary, and conversation skills.',
        level: 'A1',
      });
      await this.textbookRepository.save(textbook);
    }

    let unit = await this.unitRepository.findOne({
      where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' },
    });
    if (!unit) {
      unit = this.unitRepository.create({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        title: 'Unit 1: Getting Started',
        order: 1,
        textbook,
      });
      await this.unitRepository.save(unit);
    }

    let unit2 = await this.unitRepository.findOne({
      where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13' },
    });
    if (!unit2) {
      unit2 = this.unitRepository.create({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        title: 'Unit 2: Families and Friends',
        order: 2,
        textbook,
      });
      await this.unitRepository.save(unit2);
    }

    let unit3 = await this.unitRepository.findOne({
      where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14' },
    });
    if (!unit3) {
      unit3 = this.unitRepository.create({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        title: 'Unit 3: Places',
        order: 3,
        textbook,
      });
      await this.unitRepository.save(unit3);
    }

    const lesson1 = await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: '1A Hello',
      order: 1,
      content: `
        <div class="lesson-section">
          <h3>Reading and listening</h3>
          <div class="conversation">
            <p><strong>Conversation 1</strong></p>
            <p>A: Hello, I'm Juan. What's your name?</p>
            <p>B: I'm Akiko. Nice to meet you.</p>
            <p>A: Nice to meet you, too.</p>
          </div>
          <div class="conversation">
            <p><strong>Conversation 2</strong></p>
            <p>A: Hi, I'm Akiko. Are you Juan?</p>
            <p>B: No, I'm not. I'm Mateo.</p>
            <p>A: Oh, sorry. Hi, Mateo. Where are you from?</p>
            <p>B: I'm from Argentina. And you?</p>
            <p>A: I'm from Japan.</p>
          </div>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> introduce yourself to other students. <br/>
          <strong>Grammar:</strong> be (I and you). <br/>
          <strong>Vocabulary:</strong> countries.</p>

          <h4>Countries and Syllable Stress</h4>
          <ul>
            <li><strong>Oo:</strong> Argentina, Mexico, Poland, Turkey</li>
            <li><strong>oO:</strong> Brazil, Japan</li>
            <li><strong>Ooo:</strong> Canada, Italy</li>
            <li><strong>oOo:</strong> Argentina (can also be ooooO)</li>
            <li><strong>List of countries:</strong> Argentina, Brazil, Canada, Italy, Japan, Mexico, Poland, Spain, Thailand, Turkey, the US, the UK.</li>
          </ul>
        </div>
      `,
      media_links: [
        '/audio/1.1.mp3',
        '/audio/1.2.mp3',
        '/audio/1.3.mp3',
        '/audio/1.4.mp3',
        '/audio/1.5.mp3',
      ],
      answerKey: {
        exercise_1a_flags: {
          "1": "Canada",
          "2": "the UK",
          "3": "the US",
          "4": "Spain",
          "5": "Poland",
          "6": "Turkey",
          "7": "Japan",
          "8": "Thailand",
          "9": "Argentina",
          "10": "Mexico",
          "11": "Brazil",
          "12": "Italy"
        },
        exercise_2a_stress: {
          "Spain": "o",
          "Thailand": "Oo",
          "Turkey": "Oo",
          "Brazil": "oO",
          "Canada": "Ooo",
          "Italy": "Ooo",
          "Mexico": "Ooo",
          "Argentina": "ooOo"
        },
        exercise_4a_dialogues: {
          "gap_1": "Mexico",
          "gap_2": "Japan",
          "gap_3": "the UK",
          "gap_4": "Argentina"
        },
        exercise_5_grammar: {
          "1": "I'm",
          "2": "you're",
          "3": "aren't"
        },
        exercise_7a_dialogue: {
          "1": "Are",
          "2": "am",
          "3": ["'m", "am"],
          "4": ["'m", "am"],
          "5": "Are",
          "6": ["'m", "am"],
          "7": "are",
          "8": ["'m", "am"]
        }
      },
      unit,
    });

    await this.exerciseRepository.save({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: 'Match Countries to Flags',
      type: 'match',
      payload: {
        pairs: [
          { id: 1, left: 'Spain', right: '🇪🇸' },
          { id: 2, left: 'Brazil', right: '🇧🇷' },
          { id: 3, left: 'Japan', right: '🇯🇵' },
          { id: 4, left: 'Italy', right: '🇮🇹' },
        ],
      },
      order: 1,
      lesson: lesson1,
    });

    await this.exerciseRepository.save({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
      title: 'Fill in the blanks: Dialogue',
      type: 'fill_in_the_blank',
      payload: {
        text: 'A: Hello, I\'m {{gap_1}}. What\'s your name?<br/>B: I\'m {{gap_2}}. Nice to meet you.<br/>A: Where are you from?<br/>B: I\'m from {{gap_3}}.',
        gaps: [
          { id: 'gap_1', answer: 'Juan', options: ['Juan', 'Mateo', 'Akiko'] },
          { id: 'gap_2', answer: 'Akiko', options: ['Juan', 'Mateo', 'Akiko'] },
          { id: 'gap_3', answer: 'Spain', options: ['Spain', 'Japan', 'Argentina'] },
        ],
      },
      order: 2,
      lesson: lesson1,
    });

    const lesson2 = await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      title: '1B Jobs',
      order: 2,
      content: 'Ask and answer about jobs. Look at the map and complete profiles 1-6. Read about Green Cross Hospital staff. Grammar: be (he/she/it). Practice dialogues.',
      theory: 'Goal: ask and answer about jobs. Grammar: be (he/she/it). Vocabulary: jobs.',
      answerKey: {
        exercise_1b_jobs: {
          "1": ["taxi driver", "a taxi driver", "g"],
          "2": ["farmer", "a farmer", "e"],
          "3": ["doctor", "a doctor", "b"],
          "4": ["football player", "a football player", "a"],
          "5": ["nurse", "a nurse", "f"],
          "6": ["school teacher", "a school teacher", "teacher", "c"]
        },
        exercise_3_reading: {
          "1": ["b", "doctor"],
          "2": ["c", "nurse"],
          "3": ["a", "office worker"]
        },
        exercise_page9_profiles: {
          "lidia": ["pilot", "a pilot"],
          "sakura": ["architect", "an architect"]
        },
        exercise_4a_reading: {
          "1": ["b", "no, it isn't", "no"],
          "2": ["a", "yes, he is", "yes"],
          "3": ["b", "no, she isn't a doctor. she's an office worker", "no, she isn't"]
        },
        exercise_5a_grammar: {
          "1": ["'s", "is"],
          "2": ["'s", "is"],
          "3": ["isn't", "is not"],
          "4": ["'s", "is"]
        },
        exercise_6_dialogue: {
          "1": ["'m", "I'm", "1'm", "i'm"],
          "2": ["Is it", "/ Is it", "is it"],
          "3": ["it is", "3it is"],
          "4": ["Is the manager", "4Is the manager", "is the manager"],
          "5": ["he's", "5he's", "he is"],
          "6": ["Is he", "/ is he", "He's", "6He's", "is he"],
          "7": ["he isn't", "not", "isn't", "7isn't"],
          "8": ["'s he", "8's he", "is he"],
          "9": ["He's", "9He's", "he is"]
        },
        exercise_7a_qa: {
          "2": [
            "No, he isn't. He's a football player",
            "No, he isn't. He is football player",
            "No, he isn't. He is a football player",
            "No, he's a football player",
            "No, he isn't",
            "football player",
            "He's a football player",
            "He is a football player",
            "He is football player",
            "a football player",
            "No, he is not"
          ],
          "3": [
            "No, she isn't. She's an architect",
            "No, she isn't. She is architect",
            "No, she isn't. She is an architect",
            "No, she's an architect",
            "No, she isn't",
            "architect",
            "She's an architect",
            "She is an architect",
            "She is architect",
            "an architect",
            "No, she is not"
          ],
          "4": [
            "No, he isn't. He's a nurse",
            "No, he isn't. He is nurse",
            "No, he isn't. He is a nurse",
            "No, he's a nurse",
            "No, he isn't",
            "nurse",
            "He's a nurse",
            "He is a nurse",
            "He is nurse",
            "a nurse",
            "No, he is not",
            "Yes, he is",
            "Yes he is"
          ],
          "5": [
            "No, he isn't. He's a taxi driver",
            "No, he isn't. He is taxi driver",
            "No, he isn't. He is a taxi driver",
            "No, he's a taxi driver",
            "No, he isn't",
            "taxi driver",
            "He's a taxi driver",
            "He is a taxi driver",
            "He is taxi driver",
            "a taxi driver",
            "No, he is not",
            "Yes, he is",
            "Yes he is"
          ],
          "6": [
            "Yes, she is",
            "Yes she is",
            "She's a doctor",
            "She is a doctor",
            "She is doctor",
            "doctor",
            "a doctor",
            "Yes, she's a doctor"
          ]
        }
      },
      media_links: ['/audio/1.6.mp3', '/audio/1.7.mp3', '/audio/1.8.mp3'],
      unit,
    });

    const exercise3 = this.exerciseRepository.create({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      title: 'Write the number',
      type: 'text_input',
      payload: {
        question: 'Write the number: five',
        answer: '5',
      },
      order: 1,
      lesson: lesson2,
    });
    await this.exerciseRepository.save(exercise3);

    const exercise4 = this.exerciseRepository.create({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a34',
      title: 'Choose the correct color',
      type: 'multiple_choice',
      payload: {
        question: 'What color is the sky?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Blue',
      },
      order: 2,
      lesson: lesson2,
    });
    await this.exerciseRepository.save(exercise4);

    const lesson3 = await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      title: '1C Nationalities',
      order: 3,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary: Nationalities</h3>
          <p>Learn different countries and nationalities, word stress, and discuss people from around the world.</p>
          <h3>Reading: Me and my friends</h3>
          <p>Read Nina's blog about her friends and international office team.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> talk about different nationalities. <br/>
          <strong>Grammar:</strong> be: you/we/they. <br/>
          <strong>Vocabulary:</strong> nationalities.</p>

          <h4>Grammar: be with you / we / they</h4>
          <ul>
            <li><strong>+ Positive:</strong> You're British. / We're office workers. / They're nurses.</li>
            <li><strong>- Negative:</strong> You aren't American. / We aren't football players. / They aren't doctors.</li>
            <li><strong>? Questions & Short answers:</strong>
              <ul>
                <li>Are you British? – Yes, we are. / No, we aren't.</li>
                <li>Are we a good team? – Yes, you are. / No, you aren't.</li>
                <li>Are they in the UK? – Yes, they are. / No, they aren't.</li>
              </ul>
            </li>
            <li><strong>with Who:</strong> Who are they? – They're my friends.</li>
          </ul>

          <h4>Vocabulary: Countries and Nationalities</h4>
          <ul>
            <li>Spain – Spanish</li>
            <li>Canada – Canadian</li>
            <li>Japan – Japanese</li>
            <li>the US – American</li>
            <li>Poland – Polish</li>
            <li>Argentina – Argentinian</li>
            <li>Thailand – Thai</li>
            <li>the UK – British</li>
            <li>Turkey – Turkish</li>
            <li>Mexico – Mexican</li>
            <li>Brazil – Brazilian</li>
            <li>Italy – Italian</li>
          </ul>
        </div>
      `,
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
          '2': [
            'Are the teachers at your school American?',
            'Are the teachers at your school American',
          ],
          '3': [
            'Are your classmates from different countries?',
            'Are your classmates from different countries',
          ],
          '4': [
            'Where are you and your classmates now?',
            'Where are you and your classmates now',
          ],
          '5': ['Who are your teachers?', 'Who are your teachers'],
          '6': ['Where are your teachers from?', 'Where are your teachers from'],
        },
      },
      media_links: ['/audio/1.11.mp3', '/audio/1.12.mp3', '/audio/1.13.mp3'],
      unit,
    });

    const exercise5 = this.exerciseRepository.create({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      title: 'Complete the sentence',
      type: 'fill_in_the_blank',
      payload: {
        text: 'I {{gap_1}} to music every day.',
        gaps: [
          { id: 'gap_1', answer: 'listen', options: ['listen', 'listens', 'listening'] },
        ],
      },
      order: 1,
      lesson: lesson3,
    });
    await this.exerciseRepository.save(exercise5);

    const exercise6 = this.exerciseRepository.create({
      id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a45',
      title: 'Match verb to action',
      type: 'match',
      payload: {
        pairs: [
          { id: 1, left: 'Run', right: 'running' },
          { id: 2, left: 'Eat', right: 'eating' },
          { id: 3, left: 'Sleep', right: 'sleeping' },
        ],
      },
      order: 2,
      lesson: lesson3,
    });
    await this.exerciseRepository.save(exercise6);

    const lesson4 = await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
      title: '1D English in action & Check and reflect',
      order: 4,
      content: `
        <div class="lesson-section">
          <h3>1D English in action</h3>
          <p>Goal: ask for and give contact information. Practice useful phrases for asking, giving and checking information.</p>
          <h3>Check and reflect</h3>
          <p>Review Unit 1 vocabulary, grammar (be: singular and plural), countries, nationalities, jobs, and self-assessment.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> ask for and give contact information. Check and reflect on Unit 1.</p>
          <h4>Useful phrases</h4>
          <ul>
            <li><strong>Asking for information:</strong> What's your first name? / What's your family name? / What's your phone number? / What's your email address?</li>
            <li><strong>Checking information:</strong> Sorry, can you say that again? / How do you spell (your first name)?</li>
            <li><strong>Giving information:</strong> My first name is... / My family name is... / My number is... / My email address is...</li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1_location: {
          '1': ['b', 'in a language school'],
        },
        exercise_2_audio: {
          student: ['Selin', 'Selin Atakan'],
          country: ['Turkey', 'from Turkey'],
        },
        exercise_3b_contact: {
          '1': ['First name', 'first name', 'firstname'],
          '2': ['Family name', 'family name', 'Surname', 'surname', 'last name'],
          '3': ['Phone number', 'phone number', 'phone', 'number'],
          '4': ['Email address', 'email address', 'email', 'e-mail'],
        },
        exercise_4a_dialogue: {
          '1': [
            "What's your name",
            'What is your name',
            "What's your full name",
            'What is your full name',
          ],
          '2': ['How do you spell your', 'How do you spell'],
          '3': [
            "what's your family name",
            'your family name',
            'what is your family name',
            "what's your surname",
            'your surname',
          ],
          '4': [
            "What's your phone number",
            'What is your phone number',
            'What is your number',
            "What's your number",
          ],
          '5': ['can you say that again', 'could you say that again'],
          '6': [
            "what's your email address",
            'what is your email address',
            "what's your email",
            'what is your email',
          ],
        },
        exercise_1_wordsearch: {
          argentina: ['Argentina', 'argentina'],
          brazil: ['Brazil', 'brazil'],
          canada: ['Canada', 'canada'],
          italy: ['Italy', 'italy'],
          japan: ['Japan', 'japan'],
          mexico: ['Mexico', 'mexico'],
          poland: ['Poland', 'poland'],
          spain: ['Spain', 'spain'],
          thailand: ['Thailand', 'thailand'],
          turkey: ['Turkey', 'turkey'],
        },
        exercise_2a_order: {
          '2': [
            'I am not from London',
            'I am not from London.',
            "I'm not from London",
            "I'm not from London.",
          ],
          '3': ['Are you in my class?', 'Are you in my class'],
          '4': ['Where are you from?', 'Where are you from'],
          '5': [
            'No, you are not in my class',
            'No, you are not in my class.',
            'No you are not in my class',
            "No, you're not in my class",
            "No, you aren't in my class",
          ],
        },
        exercise_3_be: {
          '1_a': ['Are', 'are'],
          '1_b': ["'m", 'am', "I'm", 'm'],
          '2_a1': ["'m", 'am'],
          '2_a2': ['Are', 'are'],
          '2_b1': ["'m not", 'am not'],
          '2_b2': ["'m", 'am'],
          '3_a1': ["'m", 'am'],
          '3_a2': ["'m", 'am'],
          '3_b': ["'m", 'am'],
          '4_a': ['Am', 'am'],
          '4_b': ["aren't", 'are not', "'re not"],
        },
        exercise_4_jobs: {
          '2': ['school teacher', 'teacher'],
          '3': ['farmer'],
          '4': ['office worker'],
          '5': ['pilot'],
          '6': ['doctor'],
          '7': ['taxi driver'],
          '8': ['nurse'],
        },
        exercise_5_is_isnt: {
          '1': [
            'Lionel Messi is a football player',
            'Lionel Messi is a football player.',
          ],
          '2': ['Is Marina from Italy?', 'Is Marina from Italy'],
          '3': [
            'Yes, Yoko is in Class 5',
            'Yes, Yoko is in Class 5.',
            "Yes, Yoko's in Class 5.",
          ],
          '4': [
            "The White House isn't in New York",
            "The White House isn't in New York.",
            'The White House is not in New York',
            'The White House is not in New York.',
          ],
          '5': ['Is Pete a doctor?', 'Is Pete a doctor'],
          '6': [
            "No, he isn't",
            "No, he isn't.",
            'No, he is not',
            'No, he is not.',
          ],
        },
        exercise_6_corrections: {
          '2': [
            "Cristiano Ronaldo isn't a doctor. He's a football player.",
            "Cristiano Ronaldo isn't a doctor. He's a football player",
            'Cristiano Ronaldo is not a doctor. He is a football player.',
          ],
          '3': [
            "The students aren't at a British university. They're at an American university.",
            "The students aren't at a British university. They're American.",
            'The students are not at a British university. They are at an American university.',
          ],
          '4': [
            "Celine Dion isn't from Spain. She's from Canada.",
            "Celine Dion isn't from Spain. She's from Canada",
            'Celine Dion is not from Spain. She is from Canada.',
          ],
          '5': [
            "We aren't from Spain. We're from all over the world.",
            "We aren't from Spain. We're from all over the world",
            'We are not from Spain. We are from all over the world.',
          ],
        },
        exercise_7a_nationalities: {
          '2': ['Turkish', 'turkish'],
          '3': ['Japanese', 'japanese'],
          '4': ['Canadian', 'canadian'],
          '5': ['Brazilian', 'brazilian'],
          '6': ['Spanish', 'spanish'],
          '7': ['Argentinian', 'argentinian'],
          '8': ['Mexican', 'mexican'],
          '9': ['Polish', 'polish'],
          '10': ['Thai', 'thai'],
        },
        exercise_8_alternatives: {
          '1': ["They're", "they're"],
          '2': ['are we'],
          '3': ['They are', 'they are'],
          '4_a': ['Are you', 'are you'],
          '4_b1': ["We aren't", "we aren't"],
          '4_b2': ["We're", "we're"],
          '5': ["You aren't", "you aren't"],
        },
        exercise_9_text: {
          '1': ['are'],
          '2': ["aren't", 'are not'],
          '3': ["'re", 'are'],
        },
      },
      media_links: ['/audio/1.14.mp3', '/audio/1.15.mp3'],
      unit,
    });

    const lesson5 = await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
      title: '2A Families',
      order: 5,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary: Family</h3>
          <p>Learn family members and relationships: mother, father, parents, son, daughter, children, brother, sister, husband, wife.</p>
          <h3>Listening: Family Photos</h3>
          <p>Listen to people describing their families and complete the sentences with possessive adjectives.</p>
          <h3>Grammar: Possessive 's & Possessive Adjectives</h3>
          <p>Practice possessive 's (Rafael is Cristina's husband) and possessive adjectives (my, your, his, her, its, our, their).</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> talk about your family.<br/>
          <strong>Grammar:</strong> possessive 's, I/my, you/your, he/his, she/her, it/its, we/our, they/their.<br/>
          <strong>Vocabulary:</strong> family.</p>
          <h4>Possessive 's</h4>
          <ul>
            <li>name + 's: <em>Rafael is Cristina's husband.</em></li>
            <li>word + 's: <em>My mother's name is Lily.</em></li>
          </ul>
          <h4>Possessive Adjectives</h4>
          <ul>
            <li>I → my</li>
            <li>you → your</li>
            <li>he → his</li>
            <li>she → her</li>
            <li>it → its</li>
            <li>we → our</li>
            <li>they → their</li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1_family_tree: {
          maria: ['Maria', 'maria'],
          alonzo: ['Alonzo', 'alonzo'],
          jose: ['José', 'Jose', 'josé', 'jose'],
          luisa: ['Luisa', 'luisa'],
        },
        exercise_2a_table: {
          '2': ['father'],
          '3': ['daughter'],
          '4': ['brother'],
          '5': ['wife'],
        },
        exercise_3_sentences: {
          '1': ['daughter'],
          '2': ['husband'],
          '3': ['son'],
          '4': ['brother'],
          '5': ['father', 'dad', 'father/dad'],
          '6': ['wife'],
          '7': ['children'],
          '8': ['parents'],
        },
        exercise_4b_listening: {
          '1_husband': ['husband'],
          '1_son': ['son', 'baby'],
          '2_children': ['children', 'kids'],
          '3_sons': ['sons', 'son', 'brothers', 'brother'],
          '4_parents': ['parents'],
          '4_father': ['father', 'dad'],
          '4_mother': ['mother', 'mum'],
        },
        exercise_5_grammar: {
          '1': ['my'],
          '2': ['his'],
          '3': ['its'],
          '4': ['our'],
          '5': ['their'],
        },
        exercise_6_pronunciation: {
          '1': ['S', 's', 'same', 'Same'],
          '2': ['D', 'd', 'different', 'Different'],
          '3': ['S', 's', 'same', 'Same'],
        },
        exercise_7_dialogue: {
          '1': ['my'],
          '2': ['your'],
          '3': ['their'],
          '4': ["father's"],
          '5': ["He's", "he's"],
          '6': ['Her', 'her'],
          '7': ['your'],
          '8': ['our'],
          '9': ['His', 'his'],
          '10': ["friend's"],
        },
      },
      media_links: ['/audio/2.1.mp3', '/audio/2.2.mp3', '/audio/2.3.mp3', '/audio/2.4.mp3'],
      unit: unit2,
    });

    await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
      title: '2B Everyday things',
      order: 6,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary: Everyday objects (1)</h3>
          <p>Learn common everyday objects: a book, a phone, a desk, a key, a table, a clock, a photo, a computer, a box, a chair, a cup, a pen.</p>
          <h3>Listening: Max and Carla</h3>
          <p>Listen to Max welcoming Carla to the company and showing her around the office.</p>
          <h3>Grammar: this, that, these, those</h3>
          <p>Learn demonstrative pronouns to talk about singular and plural objects that are near or far.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> talk about everyday objects.<br/>
          <strong>Grammar:</strong> this, that, these, those.<br/>
          <strong>Vocabulary:</strong> everyday objects (a book, a phone, a desk, a key, a table, a clock, a photo, a computer, a box, a chair, a cup, a pen).</p>
          <h4>Demonstratives (this / that / these / those)</h4>
          <ul>
            <li><strong>this</strong> (singular, near): <em>This is your desk. / Is this your cup?</em></li>
            <li><strong>that</strong> (singular, far): <em>That is my computer. / What's that?</em></li>
            <li><strong>these</strong> (plural, near): <em>These are your keys. / These are my books.</em></li>
            <li><strong>those</strong> (plural, far): <em>Are those photos of your family? / Those are Jack's pens.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1b_vocab: {
          '1': ['clock', 'a clock', 'f'],
          '2': ['chair', 'a chair', 'j'],
          '3': ['table', 'a table', 'e'],
          '4': ['pen', 'a pen', 'l'],
          '5': ['cup', 'a cup', 'k'],
          '6': ['phone', 'a phone', 'b'],
          '7': ['photo', 'a photo', 'photos', 'g'],
          '8': ['key', 'a key', 'keys', 'd'],
          '9': ['computer', 'a computer', 'h'],
          '10': ['chair', 'a chair', 'j', 'desk', 'a desk', 'c'],
          '11': ['box', 'a box', 'i', 'desk', 'a desk', 'c'],
          '12': ['book', 'a book', 'books', 'a'],
        },
        exercise_3_photos: {
          '1': ['pen', 'a pen', 'l'],
          '2': ['clock', 'a clock', 'f'],
          '3': ['chair', 'a chair', 'j'],
          '4': ['book', 'a book', 'a'],
          '5': ['cup', 'a cup', 'k'],
          '6': ['key', 'a key', 'd'],
          '7': ['box', 'a box', 'i'],
          '8': ['phone', 'a phone', 'b'],
        },
        exercise_5a_picture: {
          'choice': ['B', 'b', 'Picture B', 'picture b'],
        },
        exercise_5b_dialogue: {
          '1': ['desk', 'a desk'],
          '2': ['keys', 'the keys', 'key'],
          '3': ['computer', 'a computer'],
          '4': ['desk', 'a desk', 'phone', 'a phone', 'office'],
          '5': ['photos', 'pictures', 'photo'],
          '6': ['cup', 'a cup', 'mug'],
        },
        exercise_6_grammar: {
          '1': ['this'],
          '2': ['that'],
          '3': ['these'],
          '4': ['those'],
        },
        exercise_7a_choice: {
          '1': ['a', 'This is my key.', 'This is my key'],
          '2': ['b', 'This is my book.', 'This is my book'],
          '3': ['a', "What's in this box?", "What's in this box"],
        },
        exercise_8_conversations: {
          '1': ['this'],
          '2': ['those'],
          '3_1': ['this'],
          '3_2': ['It', 'it', "It's", "it's", 'That', 'that'],
          '4_1': ['those'],
          '4_2': ['these'],
        },
      },
      media_links: [
        '/audio/2.5.mp3',
        '/audio/2.6.mp3',
        '/audio/2.7.mp3',
        '/audio/2.8.mp3',
      ],
      unit: unit2,
    });

    await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
      title: '2C Numbers',
      order: 7,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary: Numbers 1–100</h3>
          <p>Learn numbers from 1 to 100, teens (11–19), and tens (20, 30, 40... 100).</p>
          <h3>Listening: People's Profiles</h3>
          <p>Listen to conversations about people's ages, origins, and occupations.</p>
          <h3>Grammar: Question words with be</h3>
          <p>Learn how to ask questions about other people using who, what, where, how old.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> ask questions about other people.<br/>
          <strong>Grammar:</strong> question words with be.<br/>
          <strong>Vocabulary:</strong> numbers 1–100.</p>
          <h4>Numbers 1–100</h4>
          <ul>
            <li>1 one, 2 two, 3 three, 4 four, 5 five, 6 six, 7 seven, 8 eight, 9 nine, 10 ten</li>
            <li>11 eleven, 12 twelve, 13 thirteen, 14 fourteen, 15 fifteen, 16 sixteen, 17 seventeen, 18 eighteen, 19 nineteen</li>
            <li>20 twenty, 30 thirty, 40 forty, 50 fifty, 60 sixty, 70 seventy, 80 eighty, 90 ninety, 100 a hundred</li>
          </ul>
          <h4>Question Words with be</h4>
          <ul>
            <li><strong>How old:</strong> <em>How old is she? She's twenty-six.</em></li>
            <li><strong>Where:</strong> <em>Where is he from? He's from Japan.</em></li>
            <li><strong>What:</strong> <em>What's his job? He's an engineer.</em></li>
            <li><strong>Who:</strong> <em>Who's that? That's Anna.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1a_match: {
          '1': ['one'],
          '2': ['two'],
          '3': ['three'],
          '4': ['four'],
          '5': ['five'],
          '6': ['six'],
        },
        exercise_2_choice: {
          '1': ['13', '30'],
          '2': ['14', '40'],
          '3': ['15', '50'],
          '4': ['16', '60'],
          '5': ['17', '70'],
          '6': ['18', '80'],
          '7': ['19', '90'],
        },
        exercise_3a_sequence: {
          'text': ['twenty-four', 'twenty-five', 'twenty four', 'twenty five'],
        },
        exercise_4_profiles: {
          'anna_age': ['26', 'twenty-six', 'twenty six', '25', '24', '28'],
          'anna_from': ['the UK', 'UK', 'London', 'England', 'Britain'],
          'anna_job': ['receptionist', 'a receptionist', 'hotel receptionist'],
          'bill_age': ['42', 'forty-two', 'forty two', '35', '40'],
          'bill_from': ['the USA', 'USA', 'US', 'the US', 'America', 'New York'],
          'bill_job': ['doctor', 'a doctor'],
          'satoru_age': ['31', 'thirty-one', 'thirty one', '30'],
          'satoru_from': ['Japan', 'Tokyo'],
          'satoru_job': ['engineer', 'an engineer', 'software engineer'],
        },
        exercise_5_grammar_rules: {
          '1': ['before'],
          '2': ['before'],
        },
        exercise_7_questions: {
          '1': ["Who is he?", "Who's he?", "Who is he", "Who's he", "Who is that?", "Who's that?", "Who is that"],
          '2': ["Where is he from?", "Where's he from?", "Where is he from", "Where's he from"],
          '3': ["How old is he?", "How old is he"],
          '4': ["What is his job?", "What's his job?", "What is his job", "What's his job"],
          '5': ["Who are they?", "Who are they"],
        },
      },
      media_links: [
        '/audio/2.9.mp3',
        '/audio/2.10.mp3',
        '/audio/2.11.mp3',
        '/audio/2.12.mp3',
        '/audio/2.13.mp3',
        '/audio/2.14.mp3',
      ],
      unit: unit2,
    });

    await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
      title: '2D English in action',
      order: 8,
      content: `
        <div class="lesson-section">
          <h3>Function: Pay for things in a shop</h3>
          <p>Learn customer and shop assistant phrases: How much is/are...?, Can I pay by card?, Cash or card?, Here's your change/card.</p>
          <h3>Check and Reflect (Unit 2)</h3>
          <p>Review family vocabulary, possessive 's, demonstrative pronouns (this, that, these, those), numbers and arithmetic words.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> pay for things in a shop.<br/>
          <strong>Review:</strong> Unit 2 Check and reflect.</p>
          <h4>Useful Phrases: In a Shop</h4>
          <ul>
            <li><strong>Customer:</strong> <em>How much is this book? How much are those cups? Can I pay by card? Here's my card.</em></li>
            <li><strong>Shop Assistant:</strong> <em>It's £12. That's £9.99. Cash or card? Here's your change. Here's your card.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_3a_dialogue: {
          '1': ['How much is', 'how much is'],
          '2': ["It's", "it's", "That's", "that's"],
          '3': ['how much is', 'How much is'],
          '4': ['How much are', 'how much are'],
          '5': ["That's", "that's", "It's", "it's"],
          '6': ['Cash or card', 'cash or card', 'Cash or card?', 'cash or card?'],
          '7': ["Here's my card", "here's my card"],
          '8': ["Here's your card", "here's your card"],
        },
        exercise_1_family: {
          '2': ['wife'],
          '3': ['son'],
          '4': ['daughter'],
          '5': ['brother'],
          '6': ['parents'],
          '7': ['sister'],
          '8': ['father'],
        },
        exercise_2_possessive: {
          '2': ["Julie's family", "Julie's family."],
          '3': ["Martin's parents", "Martin's parents."],
          '4': ["my friend's dog", "my friend's dog."],
          '5': ["my teacher's pen", "my teacher's pen."],
          '6': ["my brother's book", "my brother's book."],
        },
        exercise_3_alternatives: {
          '1': ['Our'],
          '2': ['Her'],
          '3': ['his'],
          '4': ['their'],
          '5': ['its'],
          '6': ['my'],
          '6_b': ['His'],
        },
        exercise_5_anagrams: {
          '2': ['hair'],
          '3': ['hone'],
          '4': ['en'],
          '5': ['esk'],
          '6': ['omputer'],
          '7': ['ey'],
          '8': ['hoto'],
          '9': ['up'],
          '10': ['ook'],
          '11': ['ox'],
          '12': ['lock'],
        },
        exercise_6_demonstratives: {
          '1': ['this'],
          '2': ["That's"],
          '3': ['these'],
          '4': ['those'],
        },
        exercise_7a_math: {
          '2': ['thirteen', '13'],
          '3': ['thirty', '30'],
          '4': ['fifty-six', '56'],
          '5': ['fifteen', '15'],
          '6': ['fifty', '50'],
          '7': ['forty-two', '42'],
          '8': ['fifty-six', '56'],
          '9': ['twenty-nine', '29'],
          '10': ['eighty-one', '81'],
          '11': ['thirty-six', '36'],
          '12': ['sixty-three', '63'],
        },
      },
      media_links: ['/audio/2.20.mp3', '/audio/2.21.mp3'],
      unit: unit2,
    });

    await this.lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
      title: '3A My town',
      order: 9,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary: Places in town</h3>
          <p>Learn places in a town: train station, hotel, café, bank, restaurant, supermarket, cinema, park, market, bookshop, house, flat.</p>
          <h3>Listening: People talking about their town</h3>
          <p>Listen to descriptions of towns, facilities, shops and amenities.</p>
          <h3>Grammar: There is / There are</h3>
          <p>Learn singular and plural forms with There is / There are, no, and any.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> say what's in a town.<br/>
          <strong>Grammar:</strong> There is / There are; singular and plural nouns.<br/>
          <strong>Vocabulary:</strong> places in town.</p>
          <h4>Grammar: There is / There are</h4>
          <ul>
            <li><strong>Singular (+):</strong> <em>There's a park. / There is a park.</em></li>
            <li><strong>Singular (-):</strong> <em>There isn't a bank.</em></li>
            <li><strong>Plural (+):</strong> <em>There are three cafés.</em></li>
            <li><strong>Plural (-):</strong> <em>There aren't any supermarkets. / There are no supermarkets.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1a_places: {
          '1': ['B'],
          '2': ['C'],
          '3': ['A'],
          '4': ['J'],
          '5': ['F'],
          '6': ['L'],
          '7': ['D'],
          '8': ['G'],
          '9': ['I'],
          '10': ['E'],
          '11': ['K'],
          '12': ['H'],
        },
        exercise_3_speakers: {
          '1': ['C'],
          '2': ['A'],
          '3': ['B'],
        },
        exercise_4_choices: {
          '1': ['b'],
          '2': ['b'],
          '3': ['b'],
          '4': ['a'],
          '5': ['b'],
          '6': ['a'],
        },
        exercise_5_grammar: {
          '1': ['There is', 'there is', "There's", "there's"],
          '2': ['There are', 'there are'],
          '3': ['There are', 'there are'],
        },
        exercise_7a_alternatives: {
          '1': ['are'],
          '2': ['a'],
          '3': ['is'],
          '4': ['any'],
          '5': ['no'],
          '6': ['two bookshops'],
          '7': ["There's"],
          '8': ['no'],
        },
        exercise_7b_lists: {
          '1': ['parks'],
          '2': ['café', 'cafe'],
          '3': ['restaurants'],
        },
        exercise_8_text: {
          '1': ['are'],
          '2': ['a'],
          '3': ["There's", 'there is', 'There is'],
          '4': ['there', 'There'],
          '5': ['are'],
          '6': ['no'],
        },
      },
      media_links: ['/audio/3.1.mp3', '/audio/3.2.mp3', '/audio/3.3.mp3'],
      unit: unit3,
    });

    const material = this.materialRepository.create({
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Unit 1 Audio',
      type: 'audio',
      url: '/audio/1.1.mp3',
      description: 'Audio materials for Unit 1 - Greetings and Introductions',
      unit,
    });
    await this.materialRepository.save(material);

    const material2 = this.materialRepository.create({
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: 'Unit 2 Audio',
      type: 'audio',
      url: '/audio/2.1.mp3',
      description: 'Audio materials for Unit 2 - Families and Everyday Things',
      unit: unit2,
    });
    await this.materialRepository.save(material2);

    console.log('Database seeding completed successfully!');
  }
}
