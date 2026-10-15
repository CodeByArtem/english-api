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
        'https://example.com/audio/roadmap_a1_1a_conv1.mp3',
        'https://example.com/audio/roadmap_a1_1a_conv2.mp3',
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
          "Poland": "Oo",
          "Thailand": "Oo",
          "Turkey": "Oo",
          "Japan": "oO",
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
          "1": "taxi driver",
          "2": "farmer",
          "3": "doctor",
          "4": "football player",
          "5": "nurse",
          "6": "school teacher"
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
          "2": ["No, he isn't. He's a taxi driver", "No, he isn't", "taxi driver", "He's a taxi driver"],
          "3": ["No, she isn't. She's an architect", "No, she isn't", "architect", "She's an architect"],
          "4": ["No, he isn't. He's a doctor", "No, he isn't", "doctor", "He's a doctor"],
          "5": ["Yes, he is", "He's a school teacher", "school teacher", "teacher"],
          "6": ["No, she isn't. She's a nurse", "No, she isn't", "nurse", "She's a nurse"]
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
          '3_sons': ['sons'],
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

    const material = this.materialRepository.create({
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Unit 1 Audio',
      type: 'audio',
      url: 'https://example.com/audio/unit1.mp3',
      description: 'Audio materials for Unit 1 - Greetings and Introductions',
      unit,
    });
    await this.materialRepository.save(material);

    console.log('Database seeding completed successfully!');
  }
}
