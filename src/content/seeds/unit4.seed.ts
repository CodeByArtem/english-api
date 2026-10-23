import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit4(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
      title: "4A You've got a friend",
      order: 13,
      content: `
        <div class="lesson-section">
          <h3>Reading & Vocabulary: Describing people</h3>
          <p>Read about Luca and Mehmet. Learn physical descriptions: blonde/brown/grey/red hair, blue/brown/green eyes, a beard, in his/her 20s/30s/40s/50s.</p>
          <h3>Grammar: have / has got</h3>
          <p>Learn affirmative and negative statements with have got ('ve got) and has got ('s got, hasn't got, haven't got).</p>
          <h3>Practice: Sofia & Jules in Paris</h3>
          <p>Look at the viewfinder picture and write full sentences describing people, appearance, and family.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> describe people and friends.<br/>
          <strong>Grammar:</strong> have / has got (affirmative and negative, short forms).<br/>
          <strong>Vocabulary:</strong> describing people (blonde/brown/grey/red hair, blue/brown/green eyes, beard, age in 20s/30s/40s/50s).</p>
          <h4>have got / has got</h4>
          <ul>
            <li><strong>I / You / We / They:</strong> <em>have got ('ve got)</em> / <em>haven't got</em></li>
            <li><strong>He / She / It:</strong> <em>has got ('s got)</em> / <em>hasn't got</em></li>
          </ul>
          <p>Examples: <em>I've got blonde hair and blue eyes. He's got brown hair and a beard. We haven't got a car.</em></p>
        </div>
      `,
      answerKey: {
        exercise_1_matching: {
          q1_luca: ['A', 'Photo A', 'photo a', 'a'],
          q2_mehmet: ['B', 'Photo B', 'photo b', 'b'],
        },
        exercise_2_descriptions: {
          '1': ['blonde hair'],
          '2': ['blue eyes'],
          '3': ['in his 20s', 'in 20s', '20s'],
          '4': ['brown hair'],
          '5': ['brown eyes'],
          '6': ['a beard', 'beard'],
          '7': ['in his 30s', 'in 30s', '30s'],
        },
        exercise_3a_photos: {
          '1': ['D', 'd', 'Photo D'],
          '2': ['B', 'b', 'Photo B'],
          '3': ['A', 'a', 'Photo A'],
          '4': ['C', 'c', 'Photo C'],
        },
        exercise_5_grammar: {
          '1': ['have', "'ve", 'have got', "'ve got"],
          '2': ['has', "'s", 'has got', "'s got"],
          '3': ["hasn't", "hasn't got", 'has not got', 'has not'],
        },
        exercise_7_alternatives: {
          '1': ['have'],
          '2': ['has'],
          '3': ['have'],
          '4': ["hasn't"],
          '5': ["haven't"],
          '6': ['has'],
          '7': ["haven't"],
          '8': ['have'],
        },
        exercise_8_sentences: {
          '1': ['Sofia is an office worker.', 'Sofia is an office worker', "Sofia's an office worker."],
          '2': ['She has got a son.', "She's got a son.", 'She has got a son', "She's got a son"],
          '3': [
            'She has got blonde hair and brown eyes.',
            "She's got blonde hair and brown eyes.",
            'She has got blonde hair and brown eyes',
            "She's got blonde hair and brown eyes",
          ],
          '4': ['She is in her 30s.', "She's in her 30s.", 'She is in her 30s', "She's in her 30s"],
          '5': [
            'Her son has got brown hair and blue eyes.',
            "Her son's got brown hair and blue eyes.",
            'Her son has got brown hair and blue eyes',
            "Her son's got brown hair and blue eyes",
          ],
          '6': ['He is eight years old.', "He's eight years old.", 'He is eight years old', "He's eight years old", 'He is eight.', "He's eight."],
          '7': ['They live in Paris.', 'They live in Paris'],
        },
      },
      media_links: ['/audio/4.1.mp3', '/audio/4.2.mp3'],
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
      title: '4B Have you got it?',
      order: 14,
      content: `
        <div class="lesson-section">
          <h3>Vocabulary & Listening: Everyday objects (2)</h3>
          <p>Learn 12 everyday travel and daily objects: tickets, passport, credit card, coat, food, bottle of water, camera, sunglasses, phone, money, bag, keys.</p>
          <h3>Grammar: have / has got questions & short answers</h3>
          <p>Learn question forms: <em>Have you got...? / Has he got...?</em> and short answers: <em>Yes, I have. / No, I haven't.</em></p>
          <h3>Practice: Conversation ordering & Backpack checklist</h3>
          <p>Listen to travel preparations and practice asking questions about what someone has got.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> prepare for a trip.<br/>
          <strong>Grammar:</strong> have / has got: questions and short answers.<br/>
          <strong>Vocabulary:</strong> everyday objects (tickets, passport, credit card, coat, food, bottle of water, camera, sunglasses, phone, money, bag, keys).</p>
          <h4>Questions & Short Answers</h4>
          <ul>
            <li><strong>Questions:</strong> <em>Have I / you / we / they got...?</em> | <em>Has he / she / it got...?</em></li>
            <li><strong>Short answers (+):</strong> <em>Yes, I / you / we / they have.</em> | <em>Yes, he / she / it has.</em></li>
            <li><strong>Short answers (-):</strong> <em>No, I / you / we / they haven't.</em> | <em>No, he / she / it hasn't.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_1a_objects: {
          '1': ['tickets', 'ticket', 'boarding passes', 'boarding pass'],
          '2': ['passport'],
          '3': ['credit card', 'a credit card'],
          '4': ['coat', 'a coat', 'jacket'],
          '5': ['food'],
          '6': ['bottle of water', 'a bottle of water', 'water bottle'],
          '7': ['camera', 'a camera'],
          '8': ['sunglasses'],
          '9': ['phone', 'a phone', 'mobile phone', 'smartphone'],
          '10': ['money'],
          '11': ['bag', 'a bag'],
          '12': ['keys', 'key'],
        },
        exercise_2a_activities: {
          '1': ['C', 'c', 'Photo C'],
          '2': ['B', 'b', 'Photo B'],
          '3': ['D', 'd', 'Photo D'],
          '4': ['A', 'a', 'Photo A'],
        },
        exercise_3a_destination: {
          '1': ['on holiday', 'holiday', 'on a trip', 'a trip', 'trip'],
        },
        exercise_3b_checklist: {
          phone: ['yes', 'true', 'checked'],
          camera: ['no', 'false'],
          tickets: ['no', 'false'],
        },
        exercise_5_grammar: {
          '1': ['Have', 'have'],
          '2': ['have'],
          '3': ['Has', 'has'],
          '4': ['has'],
          '5': ["hasn't"],
        },
        exercise_7a_questions: {
          '1': ['Have you got food in your bag?', 'Have you got food in your bag'],
          '2': ['Has your sister got a camera?', 'Has sister got a camera?', 'Has your sister got a camera', 'Has sister got a camera'],
          '3': ['Has your friend got a good job?', 'Has friend got a good job?', 'Has your friend got a good job', 'Has friend got a good job'],
          '4': ['Have you got sunglasses?', 'Have you got sunglasses'],
          '5': ['Have you got a big family?', 'Have you got a big family'],
          '6': ['Have you got a new phone?', 'Have you got a new phone'],
        },
        exercise_8_order: {
          '1': ['e'],
          '2': ['a'],
          '3': ['c'],
          '4': ['b'],
          '5': ['f'],
          '6': ['d'],
        },
      },
      media_links: ['/audio/4.3.mp3', '/audio/4.4.mp3', '/audio/4.5.mp3'],
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
      title: "4C Dos and don'ts",
      order: 15,
      content: `
        <div class="lesson-section">
          <h3>Reading & Vocabulary: Common verbs & advice</h3>
          <p>Read text messages giving recommendations for a trip to London: <em>visit, go to, take, try, drink, see</em>.</p>
          <h3>Grammar: Imperatives</h3>
          <p>Learn imperative forms for positive advice (<em>Visit Greenwich. / Take photos.</em>) and negative advice (<em>Don't go to Oxford Street. / Don't take taxis.</em>).</p>
          <h3>Speaking: Dos and don'ts for your city</h3>
          <p>Prepare recommendations for a visiting friend and exchange advice in pairs.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> give advice.<br/>
          <strong>Grammar:</strong> imperatives (positive and negative).<br/>
          <strong>Vocabulary:</strong> common verbs (visit, go to, take, try, drink, see).</p>
          <h4>Imperatives</h4>
          <ul>
            <li><strong>Positive (+):</strong> Use the base form of the verb without a subject: <em>Visit The British Museum.</em> / <em>Drink English tea.</em></li>
            <li><strong>Negative (-):</strong> Use <strong>Don't</strong> + base form: <em>Don't go to Oxford Street.</em> / <em>Don't take taxis.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_2a_messages: {
          '1': ['work trip', 'a work trip', 'work trip to London', 'for work', 'a work trip next week', 'she has a work trip', 'business trip'],
        },
        exercise_2b_collocations: {
          '1': ['try'],
          '2_1': ['go to', 'visit'],
          '2_2': ['visit', 'go to'],
          '3': ['take'],
          '4': ['drink'],
          '5': ['see'],
        },
        exercise_3_photos: {
          '1': ['drink tea', 'drink English tea'],
          '2': ['see a show'],
          '3': ['go to New York', 'visit New York'],
          '4': ['try Japanese food'],
          '5': ['take a train'],
          '6': ['take photos'],
        },
        exercise_4_london_dos: {
          '1': ['no', 'false'],
          '2': ['yes', 'true'],
          '3': ['no', 'false'],
          '4': ['yes', 'true'],
          '5': ['yes', 'true'],
          '6': ['yes', 'true'],
          '7': ['yes', 'true'],
          '8': ['yes', 'true'],
          '9': ['yes', 'true'],
        },
        exercise_5_grammar: {
          '1': ["Don't", "don't"],
          '2': ["Don't", "don't"],
          '3': ['See', 'see'],
        },
        exercise_6a_stress: {
          '1': ["Don't go to Notting Hill"],
          '2': ['Try Polish food'],
          '3': ['Drink coffee in a café'],
          '4': ["Don't take photos"],
        },
        exercise_7_rome: {
          '1': ['Drink coffee.', 'Drink coffee', 'drink coffee.'],
          '2': ['Try Italian food.', 'Try Italian food', 'Try pasta.', 'Try pasta', 'Eat pasta.', 'Eat pasta'],
          '3': ['Visit the Colosseum.', 'Visit the Colosseum', 'Go to the Colosseum.', 'Go to the Colosseum'],
          '4': ['See a show.', 'See a show', 'See a film.', 'See a film'],
          '5': ["Don't take a coat.", "Don't take a coat", 'do not take a coat.'],
          '6': ["Don't take photos.", "Don't take photos", "Don't take a camera.", "Don't take a camera"],
        },
      },
      media_links: ['/audio/4.9.mp3', '/audio/4.10.mp3'],
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
      title: '4D English in action',
      order: 16,
      content: `
        <div class="lesson-section">
          <h3>English in action: Telling the time</h3>
          <p>Read digital and analogue clocks and ask/answer questions about the time using <em>o'clock, half past, quarter past, quarter to</em>.</p>
          <h3>Check and reflect: Unit 4 Review</h3>
          <p>Consolidate vocabulary (appearance, colors, age), <em>have/has got</em>, imperatives, and self-assess confidence.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> tell the time.<br/>
          <strong>Useful phrases:</strong> <em>What time is it? / It's (four) o'clock. / It's quarter past / half past / quarter to / five to...</em><br/>
          <strong>Review:</strong> have/has got (+, -, ?), appearance words, imperatives for advice.</p>
        </div>
      `,
      answerKey: {
        exercise_2_clocks_match: {
          '1': ['E', 'e'],
          '2': ['F', 'f'],
          '3': ['B', 'b'],
          '4': ['C', 'c'],
        },
        exercise_3_conversations: {
          '1': ["It's three", "it's three", 'Three', 'three'],
          '2': ['quarter past six', "it's quarter past six", "It's quarter past six"],
          '3': ['half past eleven', "it's half past eleven"],
          '4': ['quarter to eleven', 'at quarter to eleven', "it's quarter to eleven"],
        },
        exercise_4_useful_phrases: {
          '1': ["It's quarter past four.", "It's quarter past four", 'quarter past four'],
          '2': ["It's five to five.", "It's five to five", 'five to five'],
          '3': ["It's four o'clock.", "It's four o'clock", "four o'clock"],
          '4': ["It's twenty to five.", "It's twenty to five", 'twenty to five'],
          '5': ["It's quarter to five.", "It's quarter to five", 'quarter to five'],
          '6': ["It's half past four.", "It's half past four", 'half past four'],
          '7': ["It's five past four.", "It's five past four", 'five past four'],
        },
        exercise_check_1_wordmap: {
          colours_1: ['blonde'],
          colours_2: ['brown'],
          colours_3: ['grey', 'gray'],
          colours_4: ['red'],
          age_1: ['in her 20s'],
          age_2: ['in his 50s'],
          body_1: ['a beard'],
          body_2: ['eyes'],
          body_3: ['hair'],
        },
        exercise_check_2_sentences: {
          '1': ['blonde'],
          '2': ['in her 20s'],
          '3': ['a beard'],
          '4': ['in his 80s'],
          '5': ['eyes'],
        },
        exercise_check_3_have_got: {
          '1': ["'ve got", 'have got'],
          '2': ["haven't got", 'have not got'],
          '3': ["'s got", 'has got'],
          '4': ["hasn't got", 'has not got'],
          '5': ["hasn't got", 'has not got'],
          '6': ["'ve got", 'have got'],
          '7': ["haven't got", 'have not got'],
          '8': ['has got', "'s got"],
        },
        exercise_check_5a_order: {
          '1': ['Have you got a phone?', 'Have you got a phone'],
          '2': ['Has your teacher got green eyes?', 'Has your teacher got green eyes'],
          '3': ['Have your parents got blonde hair?', 'Have your parents got blonde hair'],
          '4': ['Have you got food in your bag?', 'Have you got food in your bag'],
          '5': ['Has your phone got a good camera?', 'Has your phone got a good camera'],
          '6': ['Have you got a bottle of water?', 'Have you got a bottle of water'],
          '7': ['How many credit cards have you got?', 'How many credit cards have you got'],
        },
        exercise_check_6_alternatives: {
          '1': ['Go to'],
          '2': ['Visit'],
          '3': ['Take'],
          '4': ['Take'],
          '5': ["Don't take"],
          '6': ['Try'],
          '7': ['Drink'],
          '8': ['See'],
        },
        exercise_check_7_uk: {
          '1': ['Take your passport.', 'Take your passport'],
          '2': ["Don't go to Leicester Square.", "Don't go to Leicester Square", 'Do not go to Leicester Square.'],
          '3': ['Try British food.', 'Try British food', 'Eat British food.'],
          '4': ["Don't drink coffee.", "Don't drink coffee", 'Do not drink coffee.'],
          '5': ["Don't take a taxi.", "Don't take a taxi", "Don't take taxis.", "Don't take taxis"],
          '6': ['Go to a market.', 'Go to a market', 'Visit a market.', 'Go to the market.'],
        },
      },
      media_links: ['/audio/4.11.mp3', '/audio/4.12.mp3'],
      unit,
    });


}
