import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit6(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  // ----------------------------------------------------
  // Lesson 6A: Good and bad habits
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f01',
    title: '6A Good and bad habits',
    order: 21,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Time Expressions</h3>
        <p>Learn common time expressions: <em>in the morning, every day, in the evening, at the weekend, in the afternoon, at night, every week</em> and match pictures with everyday habits.</p>
        <h3>Reading: Good and Bad Habits</h3>
        <p>Read about Erica's healthy lifestyle and habits versus Tina's bad habits and study routines.</p>
        <h3>Grammar: Present Simple (he / she / it)</h3>
        <p>Master 3rd person singular forms in Present Simple: regular <em>+ -s</em>, verbs ending in consonant + y <em>-y &rarr; -ies</em>, verbs ending in -ch/-sh/-ss/-x/-o <em>+ -es</em>, and negative statements with <em>doesn't + verb</em>.</p>
        <h3>Pronunciation: Verb Endings /s/, /z/, and /ɪz/</h3>
        <p>Listen to pronunciation distinctions between /s/ (starts, walks, puts), /z/ (arrives, goes, studies, wears), and /ɪz/ (finishes, uses, watches).</p>
        <h3>Speaking & Interaction: Habits of Friends & Family</h3>
        <p>Prepare notes about a friend's or family member's habits and record a summary using the voice recorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about another person's habits.<br/>
        <strong>Grammar:</strong> present simple: <em>he / she / it</em>.<br/>
        <strong>Vocabulary:</strong> time expressions.</p>
        <h4>Present Simple: he / she / it</h4>
        <ul>
          <li><strong>+ Affirmative:</strong>
            <ul>
              <li>He <em>gets up</em> early.</li>
              <li>She <em>works</em> at home.</li>
              <li>It <em>starts</em> at nine.</li>
            </ul>
          </li>
          <li><strong>- Negative:</strong>
            <ul>
              <li>He <em>doesn't have</em> dinner at home.</li>
              <li>She <em>doesn't work</em> every day.</li>
              <li>It <em>doesn't leave</em> at 6 o'clock.</li>
            </ul>
          </li>
        </ul>
        <h4>Spelling Rules for 3rd Person Singular (he / she / it)</h4>
        <ul>
          <li>For most verbs, add <strong>-s</strong>: <em>work &rarr; works, arrive &rarr; arrives, live &rarr; lives</em>.</li>
          <li>For verbs ending in consonant + <strong>-y</strong>, change y to <strong>-ies</strong>: <em>study &rarr; studies, try &rarr; tries</em>.</li>
          <li>For verbs ending in <strong>-ch, -o, -s, -sh, -x</strong>, add <strong>-es</strong>: <em>watch &rarr; watches, go &rarr; goes, finish &rarr; finishes</em>.</li>
          <li>Irregular form: <em>have &rarr; has</em>.</li>
        </ul>
        <h4>Time Expressions</h4>
        <ul>
          <li><em>in the morning / in the afternoon / in the evening</em></li>
          <li><em>at night / at the weekend</em></li>
          <li><em>every day / every week / every month</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['F', 'f', 'Picture F', 'Photo F'],
        '2': ['C', 'c', 'Picture C', 'Photo C'],
        '3': ['A', 'a', 'Picture A', 'Photo A'],
        '4': ['D', 'd', 'Picture D', 'Photo D'],
        '5': ['G', 'g', 'Picture G', 'Photo G'],
        '6': ['B', 'b', 'Picture B', 'Photo B'],
        '7': ['E', 'e', 'Picture E', 'Photo E'],
      },
      exercise_4a_reading: {
        '1': ['B', 'b', 'Photo B', 'Picture B'],
        '2': ['A', 'a', 'Photo A', 'Picture A'],
      },
      exercise_4b_habit: {
        '1': ['a', 'A', 'something people often do'],
      },
      exercise_5_sentences: {
        '1': [
          "She doesn't take the bus.",
          "She doesn't take the bus",
          "she doesn't take the bus.",
          "she doesn't take the bus",
          "She does not take the bus.",
          "She does not take the bus",
        ],
        '2': [
          "She doesn't eat chocolate or cakes.",
          "She doesn't eat chocolate or cakes",
          "she doesn't eat chocolate or cakes.",
          "she doesn't eat chocolate or cakes",
          "She does not eat chocolate or cakes.",
          "She does not eat chocolate or cakes",
        ],
        '3': [
          'She goes to the gym.',
          'She goes to the gym',
          'she goes to the gym.',
          'she goes to the gym',
        ],
        '4': [
          'She watches TV.',
          'She watches TV',
          'she watches TV.',
          'she watches TV',
        ],
        '5': [
          'She never studies.',
          'She never studies',
          'she never studies.',
          'she never studies',
        ],
      },
      exercise_6_grammar: {
        '1': ['-s', 's', 'S', '-S'],
        '2': ['-ies', 'ies', 'IES', '-IES'],
        '3': ['-es', 'es', 'ES', '-ES'],
      },
      exercise_7a_pronunciation: {
        s_sound: ['puts', 'starts', 'walks'],
        z_sound: ['arrives', 'goes', 'studies', 'wears'],
        iz_sound: ['finishes', 'uses', 'watches'],
      },
      exercise_8_sentences: {
        '1_1': ["doesn't cycle", 'does not cycle', 'doesn’t cycle'],
        '1_2': ['takes'],
        '2_1': ["doesn't eat", 'does not eat', 'doesn’t eat'],
        '2_2': ['has'],
        '3_1': ['works'],
        '3_2': ["doesn't work", 'does not work', 'doesn’t work'],
        '4_1': ["doesn't study", 'does not study', 'doesn’t study'],
        '4_2': ['teaches'],
        '5_1': ["doesn't read", 'does not read', 'doesn’t read'],
        '5_2': ['studies'],
      },
    },
    media_links: ['/audio/6.1.mp3', '/audio/6.2.mp3', '/audio/6.3.mp3'],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 6B: Jobs around the house
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f02',
    title: '6B Jobs around the house',
    order: 22,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Jobs Around the House</h3>
        <p>Learn key household chore phrases: <em>clean the bathroom, cook dinner, feed the dog, go to the supermarket, make the beds, walk the dog, do the washing, wash the dishes</em>.</p>
        <h3>Listening: Albert and Bella</h3>
        <p>Listen to Bella talk about how she and her brother Albert divide chores in their household.</p>
        <h3>Grammar: Present Simple Questions (he / she / it)</h3>
        <p>Practice Yes/No questions (<em>Does he/she + base verb?</em>), short answers (<em>Yes, he does. / No, he doesn't.</em>), and Wh- questions (<em>Where does he walk the dog? / What jobs does he do?</em>).</p>
        <h3>Pronunciation: Weak and Strong Forms of <em>Does</em></h3>
        <p>Notice weak /dəz/ in questions and stressed /dʌz/ in short affirmative answers.</p>
        <h3>Speaking & Interaction: Household Chores</h3>
        <p>Ask and answer questions about daily routines, partners, and family chores, with audio recording submission for teacher review.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about things people often do.<br/>
        <strong>Grammar:</strong> present simple questions: <em>he / she / it</em>.<br/>
        <strong>Vocabulary:</strong> jobs around the house.</p>
        <h4>Present Simple Questions: he / she / it</h4>
        <h5>Yes / No Questions</h5>
        <ul>
          <li><strong>? Question:</strong> <em>Does</em> she <em>clean</em> the bathroom?</li>
          <li><strong>+ Short Answer:</strong> Yes, she <em>does</em>.</li>
          <li><strong>- Short Answer:</strong> No, she <em>doesn't</em>.</li>
        </ul>
        <h5>Wh- Questions</h5>
        <ul>
          <li>What jobs <em>does</em> he <em>do</em> around the house?</li>
          <li>How often <em>does</em> he <em>clean</em> the kitchen?</li>
          <li>Where <em>does</em> he <em>walk</em> the dog?</li>
          <li>When <em>does</em> it <em>open</em>?</li>
          <li>Who <em>does</em> Bonnie <em>live</em> with?</li>
        </ul>
        <h4>Common Chores Collocations</h4>
        <ul>
          <li><em>clean</em> the bathroom / the toilet / the house / the kitchen</li>
          <li><em>cook</em> dinner / lunch / chicken / fish</li>
          <li><em>feed</em> the dog / the cat / the children / the birds</li>
          <li><em>wash</em> the dishes / the car / the cups / the windows</li>
          <li><em>do</em> the washing / the housework / the shopping</li>
          <li><em>make</em> the beds / breakfast</li>
          <li><em>walk</em> the dog</li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['C', 'c', 'Picture C', 'Photo C'],
        '2': ['A', 'a', 'Picture A', 'Photo A'],
        '3': ['D', 'd', 'Picture D', 'Photo D'],
        '4': ['H', 'h', 'Picture H', 'Photo H'],
        '5': ['B', 'b', 'Picture B', 'Photo B'],
        '6': ['F', 'f', 'Picture F', 'Photo F'],
        '7': ['G', 'g', 'Picture G', 'Photo G'],
        '8': ['E', 'e', 'Picture E', 'Photo E'],
      },
      exercise_3_phrases: {
        '1': ['clean', 'Clean'],
        '2': ['cook', 'Cook'],
        '3': ['feed', 'Feed'],
        '4': ['wash', 'Wash'],
      },
      exercise_4a_listening: {
        cleans_the_bathroom: ['Bella', 'bella'],
        cooks_dinner: ['Bella', 'bella'],
        washes_the_dishes: ['Bella', 'bella'],
        does_the_washing: ['Albert', 'albert'],
        walks_the_dog: ['Albert', 'albert'],
      },
      exercise_4b_questions: {
        '1': ['Do', 'do'],
        '2': ['does', 'Does'],
        '3': ['does', 'Does'],
        '4': ['does', 'Does'],
        '5': ['do', 'Do'],
      },
      exercise_5_grammar: {
        '1': ['Does', 'does'],
        '2': ['does', 'Does'],
        '3': ["doesn't", 'does not', "doesn’t"],
        '4': ['does', 'Does'],
        '5': ['does', 'Does'],
        '6': ['does', 'Does'],
        '7': ['does', 'Does'],
      },
      exercise_7_dialogue: {
        '1': ['Do', 'do'],
        '2': ['walk'],
        '3': ["don't", 'do not', "don’t"],
        '4': ['walks'],
        '5': ['do', 'Do'],
        '6': ['go'],
        '7': ['Does', 'does'],
        '8': ['run'],
        '9': ['does', 'Does'],
        '10': ['plays'],
        '11': ['does', 'Does'],
        '12': ['have'],
        '13': ['Does', 'does'],
        '14': ['feed'],
        '15': ['does', 'Does'],
      },
      exercise_8a_questions: {
        '1': ['Where does your friend live?', 'Where does your friend live'],
        '2': [
          'Does your friend live in a house or a flat?',
          'Does your friend live in a house or a flat',
        ],
        '3': [
          'Who does your friend live with?',
          'Who does your friend live with',
        ],
        '4': ['Where does your friend work?', 'Where does your friend work'],
        '5': ['Does your friend have a dog?', 'Does your friend have a dog'],
        '6': [
          'How often do you talk to your friend?',
          'How often do you talk to your friend',
        ],
      },
    },
    media_links: [
      '/audio/6.4.mp3',
      '/audio/6.5.mp3',
      '/audio/6.6.mp3',
      '/audio/6.7.mp3',
    ],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 6C: Skills
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f03',
    title: '6C Skills',
    order: 23,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Skills & Abilities</h3>
        <p>Learn action verbs for skills: <em>build a website, dance, draw pictures, fly a plane, make a cake, make clothes, play football, ride a horse, sing, sleep on a train, speak two languages, swim</em>.</p>
        <h3>Listening: ChooseYourJob.com</h3>
        <p>Listen to Yusuf and Gloria answering online questions about abilities to discover the ideal career (teacher).</p>
        <h3>Grammar: can / can't for Ability</h3>
        <p>Master affirmative statements (<em>I can sing</em>), negative statements (<em>I can't drive</em>), yes/no questions (<em>Can you use a computer? - Yes, I can / No, I can't</em>), and wh- questions (<em>What can you cook? / How many languages can you speak?</em>).</p>
        <h3>Pronunciation: Weak & Strong forms of can / can't</h3>
        <p>Differentiate between unstressed /kən/ in questions, stressed /kæn/ in short affirmative answers, and /kɑːnt/ in negatives.</p>
        <h3>Speaking: Club Teachers Interview</h3>
        <p>Formulate questions for potential sports, food, travel, and computer club teachers, and record a spoken recommendation.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about things you can and can't do.<br/>
        <strong>Grammar:</strong> <em>can / can't</em> for ability.<br/>
        <strong>Vocabulary:</strong> skills.</p>
        <h4>can / can't for ability</h4>
        <ul>
          <li><strong>+ Affirmative:</strong> I / You / He / She / It / We / They <strong>can</strong> + base verb (<em>I can swim</em>).</li>
          <li><strong>- Negative:</strong> I / You / He / She / It / We / They <strong>can't</strong> + base verb (<em>He can't drive</em>).</li>
          <li><strong>Yes / No Questions:</strong> <strong>Can</strong> you / he / they + base verb? (<em>Can you play football? - Yes, I can. / No, I can't.</em>)</li>
          <li><strong>Information Questions:</strong> Question word + <strong>can</strong> + subject + base verb? (<em>What can you cook?</em>)</li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['H', 'h', 'Photo H', 'Picture H'],
        '2': ['L', 'l', 'Photo L', 'Picture L'],
        '3': ['A', 'a', 'Photo A', 'Picture A'],
        '4': ['D', 'd', 'Photo D', 'Picture D'],
        '5': ['I', 'i', 'Photo I', 'Picture I'],
        '6': ['F', 'f', 'Photo F', 'Picture F'],
        '7': ['E', 'e', 'Photo E', 'Picture E'],
        '8': ['J', 'j', 'Photo J', 'Picture J'],
        '9': ['G', 'g', 'Photo G', 'Picture G'],
        '10': ['B', 'b', 'Photo B', 'Picture B'],
        '11': ['C', 'c', 'Photo C', 'Picture C'],
        '12': ['K', 'k', 'Photo K', 'Picture K'],
      },
      exercise_1c_audio: {
        '1': ['play football', 'play football.', 'football'],
        '2': ['ride a horse', 'ride a horse.', 'horse'],
        '3': ['swim', 'swim.'],
        '4': ['sing', 'sing.'],
        '5': ['fly a plane', 'fly a plane.', 'plane'],
        '6': ['dance', 'dance.'],
      },
      exercise_2b_job: {
        '1': ['teacher', 'Teacher', 'a teacher', 'A teacher'],
      },
      exercise_2c_skills: {
        computer: ['true', 'yes'],
        website: ['false', 'no'],
        languages: ['true', 'yes'],
        drive: ['false', 'no'],
        cook: ['true', 'yes'],
        draw: ['true', 'yes'],
        sing: ['true', 'yes'],
        dance: ['true', 'yes'],
      },
      exercise_3_grammar: {
        '1': ['sing', 'Sing'],
        '2': ['drive', 'Drive'],
        '3': ['use', 'Use'],
        '4': ['play', 'Play'],
        '5': ['cook', 'Cook'],
        '6': ['speak', 'Speak'],
      },
      exercise_4a_sounds: {
        '1': ['different', 'Different'],
        '2': ['different', 'Different'],
        '3': ['different', 'Different'],
      },
      exercise_5_dialogue: {
        '1': ['Can you'],
        '2': ['I can'],
        '3': ['Can you'],
        '4': ['I can'],
        '5': ['Can you'],
        '6': ['I can'],
        '7': ['can you'],
        '8': ['can'],
        '9': ['Can you'],
        '10': ['can'],
      },
      exercise_6a_taxi: {
        '1': ['Can you drive?', 'Can you drive'],
      },
      exercise_6a_office: {
        '1': ['Can you use a computer?', 'Can you use a computer'],
      },
      exercise_6a_hotel: {
        '1': ['Can you speak two languages?', 'Can you speak English?', 'Can you speak two languages'],
      },
    },
    media_links: [
      '/audio/6.13.mp3',
      '/audio/6.14.mp3',
      '/audio/6.15.mp3',
      '/audio/6.16.mp3',
    ],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 6D: English in action & Check and reflect
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f04',
    title: '6D English in action & Check and reflect',
    order: 24,
    content: `
      <div class="lesson-section">
        <h3>English in Action: Making Requests</h3>
        <p>Master asking politely (<em>Can I / Can you...?</em>), accepting requests (<em>Sure / Yes, I can / No problem</em>), and declining politely (<em>I'm sorry, I can't</em>).</p>
        <h3>Listening: Flatmates Tom and Ana</h3>
        <p>Listen to household requests regarding walking the dog, cleaning the bathroom, doing laundry, going to the supermarket, making beds, and washing dishes.</p>
        <h3>Check & Reflect: Unit 6 Review</h3>
        <p>Comprehensive consolidation of time phrases, 3rd person singular present simple verb endings, negative sentences with <em>doesn't</em>, household collocations, questions with <em>do / does</em>, and abilities with <em>can / can't</em>.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> make requests and review Unit 6.<br/>
        <strong>Useful Phrases:</strong></p>
        <h4>Making requests</h4>
        <ul>
          <li><em>Can I (use your bike), (please)?</em></li>
          <li><em>Can you (walk the dog), (please)?</em></li>
        </ul>
        <h4>Saying yes to requests</h4>
        <ul>
          <li><em>Yes, you can. / Yes, I can. / Sure. / No problem.</em></li>
        </ul>
        <h4>Saying no to requests</h4>
        <ul>
          <li><em>I'm sorry, I can't. / I'm sorry, you can't.</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1_jobs: {
        A: ['wash the dishes', 'wash dishes', 'do the washing up', 'washing up'],
        B: ['go to the supermarket', 'buy food', 'supermarket'],
        C: ['walk the dog', 'feed the dog'],
        D: ['do the washing', 'wash clothes'],
        E: ['clean the bathroom'],
        F: ['make the bed', 'make the beds'],
      },
      exercise_2_matching: {
        '1': ['C', 'c', 'Picture C'],
        '2': ['E', 'e', 'Picture E'],
        '3': ['D', 'd', 'Picture D'],
        '4': ['B', 'b', 'Picture B'],
        '5': ['F', 'f', 'Picture F'],
        '6': ['A', 'a', 'Picture A'],
      },
      exercise_3_who: {
        '1': ['T', 't', 'Tom'],
        '2': ['T', 't', 'Tom'],
        '3': ['T', 't', 'Tom'],
        '4': ['A', 'a', 'Ana'],
        '5': ['A', 'a', 'Ana'],
        '6': ['A', 'a', 'Ana'],
      },
      exercise_4a_requests: {
        count: ['8', 'eight'],
      },
      exercise_5a_dialogue: {
        '1a': ['Can you'],
        '1b': ['Sure', 'Yes, I can', 'No problem'],
        '2a': ['Can I'],
        '2b': ['Yes, you can', 'Sure', 'No problem'],
        '3a': ['Can I'],
        '3b': ["I'm sorry, you can't", "I'm sorry, I can't"],
        '4a': ['Can you'],
        '4b': ["I'm sorry, I can't"],
      },
      check_1_time_phrases: {
        '1': ['c', 'C'],
        '2': ['e', 'E'],
        '3': ['d', 'D'],
        '4': ['a', 'A'],
        '5': ['b', 'B'],
        '6': ['f', 'F'],
      },
      check_2_text: {
        '1': ['in the morning'],
        '2': ['in the afternoon'],
        '3': ['In the evening', 'in the evening'],
        '4': ['at the weekend'],
      },
      check_3_verbs: {
        '1': ['works'],
        '2': ['gets up'],
        '3': ['travels'],
        '4': ["doesn't talk", 'does not talk'],
        '5': ['draws'],
        '6': ['reads'],
        '7': ["doesn't have", 'does not have'],
        '8': ['buys'],
        '9': ['eats'],
        '10': ['has'],
        '11': ['watches'],
        '12': ['goes'],
      },
      check_4_negatives: {
        '1': [
          "Julio doesn't study French.",
          "Julio doesn't study French",
          'Julio does not study French.',
        ],
        '2': [
          "She doesn't work in an office.",
          "She doesn't work in an office",
          'She does not work in an office.',
        ],
        '3': [
          "Aleksi doesn't listen to music on the train.",
          "Aleksi doesn't listen to music on the train",
          'Aleksi does not listen to music on the train.',
        ],
        '4': [
          "Linda doesn't teach at the university.",
          "Linda doesn't teach at the university",
          'Linda does not teach at the university.',
        ],
        '5': [
          "Amy doesn't take the bus to work.",
          "Amy doesn't take the bus to work",
          'Amy does not take the bus to work.',
        ],
        '6': [
          "Juan doesn't work in the evening.",
          "Juan doesn't work in the evening",
          'Juan does not work in the evening.',
        ],
        '7': [
          "Lizzie doesn't study in the evening.",
          "Lizzie doesn't study in the evening",
          'Lizzie does not study in the evening.',
        ],
        '8': [
          "Luke doesn't work in the morning.",
          "Luke doesn't work in the morning",
          'Luke does not work in the morning.',
        ],
        '9': [
          "Jane doesn't have lunch at home.",
          "Jane doesn't have lunch at home",
          'Jane does not have lunch at home.',
        ],
        '10': [
          "Danny doesn't watch a lot of TV.",
          "Danny doesn't watch a lot of TV",
          'Danny does not watch a lot of TV.',
        ],
      },
      check_5_match: {
        '1': ['d', 'D'],
        '2': ['c', 'C'],
        '3': ['a', 'A'],
        '4': ['b', 'B'],
        '5': ['f', 'F'],
        '6': ['g', 'G'],
        '7': ['e', 'E'],
      },
      check_6a_questions: {
        '1_aux': ['do', 'Do'],
        '1_match': ['f', 'F'],
        '2_aux': ['do', 'Do'],
        '2_match': ['d', 'D'],
        '3_aux': ['does', 'Does'],
        '3_match': ['a', 'A'],
        '4_aux': ['does', 'Does'],
        '4_match': ['e', 'E'],
        '5_aux': ['does', 'Does'],
        '5_match': ['b', 'B'],
        '6_aux': ['do', 'Do'],
        '6_match': ['c', 'C'],
      },
      check_7a_verbs: {
        '1': ['sing', 'Sing'],
        '2': ['cook', 'Cook'],
        '3': ['play', 'Play'],
        '4': ['speak', 'Speak'],
        '5': ['fly', 'Fly'],
        '6': ['build', 'Build'],
        '7': ['ride', 'Ride'],
        '8': ['use', 'Use'],
        '9': ['draw', 'Draw'],
        '10': ['sleep', 'Sleep'],
      },
      check_8a_animals: {
        '1': ['can', 'Can'],
        '2': ["can't", "can’t", 'cannot'],
        '3': ['can', 'Can'],
        '4': ["can't", "can’t", 'cannot'],
        '5': ['can', 'Can'],
        '6': ["can't", "can’t", 'cannot'],
      },
    },
    media_links: ['/audio/6.17.mp3', '/audio/6.18.mp3'],
    unit,
  });
}
