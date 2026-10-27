import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit7(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  // ----------------------------------------------------
  // Lesson 7A: Questions
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380701',
    title: '7A Questions',
    order: 25,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Places & Geography</h3>
        <p>Learn geographical and landscape words: <em>clouds, east, a field, flowers, a hill, an island, a lake, a mountain, north, a river, the sea, the sky, south, trees, west</em>.</p>
        <h3>Listening: The Lake District</h3>
        <p>Listen to Fatma and Dan discussing Dan's favourite place in the north of England — The Lake District.</p>
        <h3>Grammar: Wh- Questions</h3>
        <p>Master question words and their functions: <em>What</em> (things), <em>How</em> (way you do something), <em>When</em> (days, months, times), <em>Who</em> (people), <em>Where</em> (places), <em>How much</em> (prices), <em>How many</em> (number of things).</p>
        <h3>Pronunciation: Intonation in Questions</h3>
        <p>Notice falling intonation (&searr;) in Wh- questions and rising intonation (&nearr;) in Yes/No questions.</p>
        <h3>Speaking: Describing a Place</h3>
        <p>Ask and answer questions about great places in your country and record a voice summary using AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about a place.<br/>
        <strong>Grammar:</strong> <em>wh-</em> questions.<br/>
        <strong>Vocabulary:</strong> places and compass directions.</p>
        <h4>Wh- Question Words</h4>
        <ul>
          <li><strong>What:</strong> for things (<em>What's the name of the place?</em>)</li>
          <li><strong>How:</strong> for the way you do something (<em>How do you spell that?</em>)</li>
          <li><strong>When:</strong> for days, months, and times (<em>When do you usually go there?</em>)</li>
          <li><strong>Who:</strong> for people (<em>Who do you go with?</em>)</li>
          <li><strong>Where:</strong> for places (<em>Where is it?</em>)</li>
          <li><strong>How much:</strong> for prices (<em>How much is a train ticket?</em>)</li>
          <li><strong>How many:</strong> for the number of things (<em>How many lakes are there?</em>)</li>
        </ul>
        <h4>Compass Directions</h4>
        <p><em>North, South, East, West</em> (<em>in the north of England / in the south of Italy</em>).</p>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        A: ['the sea', 'sea', 'The sea', 'Sea'],
        B: ['north', 'North'],
        C: ['west', 'West'],
        D: ['east', 'East'],
        E: ['south', 'South'],
        F: ['a mountain', 'mountain', 'A mountain', 'Mountain'],
        G: ['an island', 'island', 'An island', 'Island'],
        H: ['a lake', 'lake', 'A lake', 'Lake'],
        I: ['a hill', 'hill', 'A hill', 'Hill'],
        J: ['a river', 'river', 'A river', 'River'],
        K: ['a field', 'field', 'A field', 'Field'],
        L: ['the sky', 'sky', 'The sky', 'Sky'],
        M: ['clouds', 'Clouds'],
        N: ['trees', 'Trees'],
        O: ['flowers', 'Flowers'],
      },
      exercise_2_table: {
        water_1: ['a lake', 'lake', 'the lake'],
        water_2: ['a river', 'river', 'the river'],
        water_3: ['the sea', 'sea', 'a sea'],
        land_1: ['a field', 'field'],
        land_2: ['a hill', 'hill'],
        land_3: ['an island', 'island'],
        land_4: ['a mountain', 'mountain'],
        plants_1: ['flowers', 'Flowers'],
        plants_2: ['trees', 'Trees'],
        air_1: ['clouds', 'Clouds'],
        air_2: ['the sky', 'sky', 'Sky'],
        directions_1: ['east', 'East'],
        directions_2: ['north', 'North'],
        directions_3: ['south', 'South'],
        directions_4: ['west', 'West'],
      },
      exercise_3_alternatives: {
        '1_1': ['clouds', 'Clouds'],
        '1_2': ['sky', 'Sky'],
        '2': ['south', 'South'],
        '3_1': ['river', 'River'],
        '3_2': ['lake', 'Lake'],
        '4_1': ['flowers', 'Flowers'],
        '4_2': ['mountains', 'Mountains'],
        '5': ['hill', 'Hill'],
        '6': ['north', 'North'],
      },
      exercise_5a_location: {
        '1': ['The Lake District', 'the lake district', 'Lake District', 'lake district'],
      },
      exercise_5b_matching: {
        '1': ['d', 'D'],
        '2': ['c', 'C'],
        '3': ['b', 'B'],
        '4': ['f', 'F'],
        '5': ['h', 'H'],
        '6': ['a', 'A'],
        '7': ['e', 'E'],
        '8': ['g', 'G'],
      },
      exercise_6_grammar: {
        '1': ['things', 'Things'],
        '2': ['way', 'Way', 'way you do something'],
        '3': ['days, months and times', 'days months and times', 'days months times'],
        '4': ['people', 'People'],
        '5': ['places', 'Places'],
        '6': ['prices', 'Prices'],
        '7': ['the number of things', 'number of things'],
      },
      exercise_8a_prompts: {
        '1': ["What is the name of the place?", "What's the name of the place?", "What is the name of the place", "What's the name of the place"],
        '2': ["Where is it?", "Where is it"],
        '3': ["When do you usually go there?", "When do you usually go there"],
        '4': ["What do you usually do there?", "What do you usually do there"],
        '5': ["How much is a train ticket from here?", "How much is a train ticket from here"],
        '6': ["How many cafés are there?", "How many cafes are there?", "How many cafés are there", "How many cafes are there"],
        '7': ["Is it a quiet place?", "Is it a quiet place"],
      },
      exercise_9_questions: {
        '1': ["Where are your parents from?", "Where are your parents from"],
        '2': ["Who do you go with?", "Who do you go with"],
        '3': ["Where is it?", "Where is it"],
        '4': ["When do you visit?", "When do you visit"],
        '5': ["How many lakes are there?", "How many lakes are there"],
        '6': ["How much is a ticket?", "How much is a ticket"],
        '7': ["How do you spell it?", "How do you spell it", "How do you spell that?", "How do you spell that"],
      },
    },
    media_links: ['/audio/7.1.mp3', '/audio/7.2.mp3', '/audio/7.3.mp3'],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 7B: A good day
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380702',
    title: '7B A good day',
    order: 26,
    content: `
      <div class="lesson-section">
        <h3>Reading: David's Year</h3>
        <p>Read about five memorable days from David's year: moving into a new flat, 31st birthday party, quiet mountain holiday, dinner at a Spanish restaurant, and the first day at a new video games company.</p>
        <h3>Vocabulary: Months, Dates & Ordinal Numbers</h3>
        <p>Learn the twelve months of the year and ordinal numbers from <em>first (1st)</em> to <em>thirty-first (31st)</em>, plus time expressions <em>last, today, week, weekend, yesterday</em>.</p>
        <h3>Grammar: Past Simple with <em>was / were</em> and <em>there was / there were</em></h3>
        <p>Understand affirmative and negative past forms: <em>I/he/she/it was / wasn't</em>, <em>we/you/they were / weren't</em>, and existential <em>there was / there were</em>.</p>
        <h3>Pronunciation: Weak & Strong Forms of <em>was / wasn't</em> and <em>were / weren't</em></h3>
        <p>Distinguish pronunciation in sentences like <em>The food wasn't cheap</em> and <em>Bill and Jane weren't there</em>.</p>
        <h3>Speaking: Five Good Days</h3>
        <p>Make notes about good days from your past year, share with partners, and record a summary for teacher assessment.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about good days and past events.<br/>
        <strong>Grammar:</strong> <em>was / were</em>, <em>there was / there were</em>.<br/>
        <strong>Vocabulary:</strong> months, ordinal dates, past time expressions.</p>
        <h4>Past Simple: was / were</h4>
        <ul>
          <li><strong>I / He / She / It:</strong> <em>was</em> / <em>wasn't</em> (was not)
            <ul>
              <li>I <em>was</em> 31 this year.</li>
              <li>The food <em>wasn't</em> cheap.</li>
            </ul>
          </li>
          <li><strong>You / We / They:</strong> <em>were</em> / <em>weren't</em> (were not)
            <ul>
              <li>We <em>were</em> at the restaurant.</li>
              <li>They <em>weren't</em> there.</li>
            </ul>
          </li>
        </ul>
        <h4>There was / There were</h4>
        <ul>
          <li><strong>Singular:</strong> <em>There was</em> a party. / <em>There wasn't</em> a lift.</li>
          <li><strong>Plural:</strong> <em>There were</em> mountains and fields. / <em>There weren't</em> any buses.</li>
        </ul>
        <h4>Time Expressions</h4>
        <p><em>today, yesterday, last week, last weekend, last month</em>.</p>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['E', 'e', 'Photo 1', 'Paragraph E'],
        '2': ['C', 'c', 'Photo 2', 'Paragraph C'],
        '3': ['B', 'b', 'Photo 3', 'Paragraph B'],
        '4': ['D', 'd', 'Photo 4', 'Paragraph D'],
        '5': ['A', 'a', 'Photo 5', 'Paragraph A'],
      },
      exercise_3a_ordinals: {
        a: ['first', '1st'],
        b: ['second', '2nd'],
        c: ['third', '3rd'],
        d: ['fourth', '4th'],
        e: ['fifth', '5th'],
        f: ['eleventh', '11th'],
        g: ['twelfth', '12th'],
        h: ['thirteenth', '13th'],
        i: ['fourteenth', '14th'],
        j: ['fifteenth', '15th'],
        k: ['twentieth', '20th'],
        l: ['twenty-first', 'twenty first', '21st'],
        m: ['twenty-second', 'twenty second', '22nd'],
        n: ['twenty-third', 'twenty third', '23rd'],
        o: ['twenty-fourth', 'twenty fourth', '24th'],
        p: ['thirtieth', '30th'],
        q: ['thirty-first', 'thirty first', '31st'],
      },
      exercise_5a_words: {
        '1': ['Today', 'today'],
        '2': ['Yesterday', 'yesterday'],
        '3': ['Last', 'last'],
        '4': ['weekend', 'Weekend'],
        '5': ['week', 'Week'],
      },
      exercise_6_grammar: {
        '1': ['was', 'Was'],
        '2': ["wasn't", 'was not', 'wasn’t'],
        '3': ['were', 'Were'],
        '4': ["weren't", 'were not', 'weren’t'],
        '5': ['was', 'Was'],
        '6': ["wasn't", 'was not', 'wasn’t'],
        '7': ['were', 'Were'],
        '8': ["weren't", 'were not', 'weren’t'],
      },
      exercise_8_alternatives: {
        '1': ['was', 'Was'],
        '2': ['was', 'Was'],
        '3': ['was', 'Was'],
        '4': ['were', 'Were'],
        '5': ["weren't", 'were not', 'weren’t'],
        '6': ['were', 'Were'],
        '7': ['were', 'Were'],
        '8': ['was', 'Was'],
      },
    },
    media_links: [
      '/audio/7.4.mp3',
      '/audio/7.5.mp3',
      '/audio/7.6.mp3',
      '/audio/7.7.mp3',
      '/audio/7.8.mp3',
    ],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 7C: How was it?
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380703',
    title: '7C How was it?',
    order: 27,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Adjectives & Opposites</h3>
        <p>Learn core opposite pairs: <em>cold &ndash; hot, dark &ndash; light, difficult &ndash; easy, fast &ndash; slow, happy &ndash; sad, high &ndash; low, long &ndash; short, old &ndash; young</em>.</p>
        <h3>Listening: Past Events & Impressions</h3>
        <p>Listen to conversations about a meeting, a mountain hike, and a crowded train journey.</p>
        <h3>Grammar: was/were (questions) & there was/were (questions)</h3>
        <p>Master asking and answering questions in the past with <em>Was/Were...?</em> and <em>Wh- questions</em>.</p>
        <h3>Speaking: Describing Past Experiences</h3>
        <p>Ask and answer questions about past events (your day, your weekend, your holiday) and record a voice summary.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about past events.<br/>
        <strong>Grammar:</strong> <em>was/were</em> (questions), <em>there was/were</em> (questions).<br/>
        <strong>Vocabulary:</strong> adjectives and opposite pairs.</p>
        <h4>Opposite Adjectives</h4>
        <ul>
          <li>cold &harr; hot</li>
          <li>dark &harr; light</li>
          <li>difficult &harr; easy</li>
          <li>fast &harr; slow</li>
          <li>happy &harr; sad</li>
          <li>high &harr; low</li>
          <li>long &harr; short</li>
          <li>old &harr; young / new</li>
        </ul>
        <h4>Grammar: was / were Questions</h4>
        <ul>
          <li><strong>Yes/No questions:</strong> <em>Was he/she/it OK?</em> &rarr; <em>Yes, he/she/it was. / No, he/she/it wasn't.</em></li>
          <li><strong>Yes/No questions:</strong> <em>Were you cold?</em> &rarr; <em>Yes, I was. / No, I wasn't.</em></li>
          <li><strong>Wh- questions:</strong> <em>Where were they? / What was it about? / How was your weekend?</em></li>
          <li><strong>there was/were questions:</strong> <em>Was there a meeting?</em> &rarr; <em>Yes, there was. / No, there wasn't.</em></li>
          <li><em>Were there a lot of people?</em> &rarr; <em>Yes, there were. / No, there weren't.</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1_opposites: {
        '1': ['c', 'hot'],
        '2': ['h', 'light'],
        '3': ['a', 'easy'],
        '4': ['f', 'slow'],
        '5': ['b', 'sad'],
        '6': ['g', 'low'],
        '7': ['e', 'short'],
        '8': ['d', 'young'],
      },
      exercise_3_sentences: {
        '1': ['cold', 'Cold'],
        '2': ['high', 'High'],
        '3': ['old', 'Old'],
        '4': ['slow', 'Slow'],
        '5': ['difficult', 'Difficult'],
        '6': ['dark', 'Dark'],
        '7': ['happy', 'Happy'],
        '8': ['short', 'Short'],
      },
      exercise_5a_matching: {
        '1': ['B', 'b', 'photo B', 'Photo B'],
        '2': ['A', 'a', 'photo A', 'Photo A'],
        '3': ['C', 'c', 'photo C', 'Photo C'],
      },
      exercise_5b_alternatives: {
        '1a': ['computers', 'Computers'],
        '1b': ['difficult', 'Difficult'],
        '2a': ['high', 'High'],
        '2b': ['cold', 'Cold'],
        '3a': ['busy', 'Busy'],
        '3b': ['hot', 'Hot'],
      },
      exercise_6_grammar: {
        '1': ['Was', 'was'],
        '2': ["wasn't", 'was not', 'wasn’t'],
        '3': ['were', 'Were'],
        '4': ['was', 'Was'],
        '5': ['was', 'Was'],
        '6': ['Were', 'were'],
      },
      exercise_8_alternatives: {
        '1': ['was', 'Was'],
        '2': ['was', 'Was'],
        '3': ['Was', 'was'],
        '4': ['was', 'Was'],
        '5': ['was', 'Was'],
        '6': ['were', 'Were'],
        '7': ['Was', 'was'],
        '8': ["wasn't", 'was not', 'wasn’t'],
      },
      exercise_9a_questions: {
        '1': ['Was your last test easy or difficult?', 'Was your last test easy or difficult'],
        '2': ['Were you at home on Saturday night?', 'Were you at home on Saturday night'],
        '3': ['Where were you at 10.00 p.m. last night?', 'Where were you at 10.00 p.m. last night', 'Where were you at 10 pm last night?'],
        '4': ['Was there a swimming pool at your school?', 'Was there a swimming pool at your school'],
        '5': ['Was it cold this morning?', 'Was it cold this morning'],
        '6': ['What was your favourite class at school?', 'What was your favourite class at school'],
      },
    },
    media_links: [
      '/audio/7.12.mp3',
      '/audio/7.13.mp3',
      '/audio/7.14.mp3',
    ],
    unit,
  });

  // ----------------------------------------------------
  // Lesson 7D: English in action & Check and reflect
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380704',
    title: '7D English in action & Check and reflect',
    order: 28,
    content: `
      <div class="lesson-section">
        <h3>English in action: Buying Travel Tickets</h3>
        <p>Learn useful phrases for inquiring about train times, single vs return tickets, platforms, and prices at Paddington Station.</p>
        <h3>Check and reflect: Unit 7 Review</h3>
        <p>Review geographical words, question words, months of the year, ordinal numbers, past tense <em>was/were</em>, opposite adjectives, and self-assessment.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> buy travel tickets and review Unit 7.<br/>
        <strong>Useful phrases: Buying travel tickets</strong></p>
        <h4>Customer</h4>
        <ul>
          <li><em>A ticket (for the fast train) to (Bath), please.</em></li>
          <li><em>What time is the next train to (Bath), please?</em></li>
          <li><em>What time does it arrive in (Bath)?</em></li>
          <li><em>Which platform is the (fast) train to (Bath), please?</em></li>
          <li><em>How much is a ticket to (Bath), please?</em></li>
        </ul>
        <h4>Ticket Assistant</h4>
        <ul>
          <li><em>Is that a single or a return?</em></li>
          <li><em>The next train leaves at (9.20).</em></li>
          <li><em>It arrives at (12.15).</em></li>
          <li><em>It leaves from platform (7).</em></li>
          <li><em>That's (&pound;68.20), please.</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_2a_train: {
        '1': ['5', 'Bath, 9.30', '9.30', 'train 5', 'Train 5'],
      },
      exercise_2b_ticket: {
        '1': ['A', 'a', 'Return £68.20', '£68.20'],
      },
      exercise_1a_compass: {
        n: ['north', 'North', 'orth', 'Orth'],
        s: ['south', 'South', 'outh', 'Outh'],
        w: ['west', 'West', 'est', 'Est'],
        e: ['east', 'East', 'ast', 'Ast'],
      },
      exercise_1b_alternatives: {
        '1_1': ['cloud', 'Cloud'],
        '1_2': ['sky', 'Sky'],
        '2_1': ['lake', 'Lake'],
        '2_2': ['fields', 'Fields'],
        '3_1': ['an island', 'island', 'Island'],
        '3_2': ['the sea', 'sea', 'Sea'],
        '4': ['mountains', 'Mountains'],
      },
      exercise_1c_words: {
        '1': ['yesterday', 'Yesterday'],
        '2': ['last', 'Last'],
        '3': ['today', 'Today'],
        '4': ['weekend', 'Weekend'],
      },
      exercise_2a_questions: {
        '1': ['What does a taxi driver do?', 'What does a taxi driver do'],
        '2': ['Where is the White House?', 'Where is the White House'],
        '3': ['Who was Pelé?', 'Who was Pele?', 'Who was Pele'],
        '4': ["When is Valentine's Day?", "When is Valentines Day?", "When is Valentine’s Day?"],
        '5': ['How many days are there in August?', 'How many days are there in August'],
        '6': ['How many rooms has the Taj Mahal got?', 'How many rooms has the Taj Mahal got'],
      },
      exercise_2b_matching: {
        '1': ['e', 'He/She drives a car.'],
        '2': ['c', "It's in Washington DC."],
        '3': ['f', 'a footballer'],
        '4': ['d', '14th February'],
        '5': ['b', '31'],
        '6': ['a', '120'],
      },
      exercise_3a_months: {
        '1': ['January', 'january', 'anuary', 'Anuary'],
        '2': ['February', 'february', 'ebruary', 'Ebruary'],
        '3': ['March', 'march', 'arch', 'Arch'],
        '4': ['April', 'april', 'pril', 'Pril'],
        '5': ['May', 'may', 'ay', 'Ay'],
        '6': ['June', 'june', 'une', 'Une'],
        '7': ['July', 'july', 'uly', 'Uly'],
        '8': ['August', 'august', 'ugust', 'Ugust'],
        '9': ['September', 'september', 'eptember', 'Eptember'],
        '10': ['October', 'october', 'ctober', 'Ctober'],
        '11': ['November', 'november', 'ovember', 'Ovember'],
        '12': ['December', 'december', 'ecember', 'Ecember'],
      },
      exercise_3b_dates: {
        '2': ['eleventh', 'Eleventh'],
        '3': ['twenty-third', 'Twenty-third', 'twenty third'],
        '4': ['nineteenth', 'Nineteenth'],
        '5': ['thirtieth', 'Thirtieth'],
        '6': ['twelfth', 'Twelfth'],
        '7': ['eighth', 'Eighth'],
        '8': ['twenty-seventh', 'Twenty-seventh', 'twenty seventh'],
        '9': ['fifth', 'Fifth'],
        '10': ['thirty-first', 'Thirty-first', 'thirty first'],
      },
      exercise_4_was_were: {
        '2': ['were', 'Were'],
        '3': ['was', 'Was'],
        '4': ['were', 'Were'],
        '5': ['was', 'Was'],
        '6': ["wasn't", 'was not', 'wasn’t'],
        '7': ['were', 'Were'],
        '8': ["wasn't", 'was not', 'wasn’t'],
        '9': ['was', 'Was'],
      },
      exercise_5_alternatives: {
        '1': ['fast', 'Fast'],
        '2': ['an old', 'old'],
        '3': ['easy', 'Easy'],
        '4': ['cold', 'Cold'],
        '5': ['long', 'Long'],
        '6': ['high', 'High'],
        '7': ['dark', 'Dark'],
        '8': ['hot', 'Hot'],
        '9': ['happy', 'Happy'],
      },
      exercise_6a_order: {
        '2': ["What was your first teacher's name?", "What was your first teachers name?", "What was your first teacher’s name?"],
        '3': ['Was your phone expensive?', 'Was your phone expensive'],
        '4': ['Where were you at 8.00 a.m.?', 'Where were you at 8.00 am?', 'Where were you at 8 am?'],
        '5': ['Was there a difficult question in class?', 'Was there a difficult question in class'],
        '6': ['How many students were there in class last week?', 'How many students were there in class last week'],
      },
    },
    media_links: [
      '/audio/7.15.mp3',
      '/audio/7.16.mp3',
      '/audio/7.17.mp3',
    ],
    unit,
  });
}
