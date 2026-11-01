import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit8(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  // ----------------------------------------------------
  // Lesson 8A: When I was young
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380801',
    title: '8A When I was young',
    order: 29,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Verb Phrases & Childhood Activities</h3>
        <p>Learn common verb collocations: <em>travel (by bus, by car, to work, to grandparents' house)</em>, <em>watch (TV, games, a film)</em>, <em>live (in a village, in a town, in a city, in a house, with my parents, with my family)</em>, <em>play (games, football, tennis, with friends)</em>, <em>talk (about the weather, about my weekend, to my parents, to my teacher, to my friends)</em>.</p>
        <h3>Reading: School Days</h3>
        <p>Read about the childhood experiences of Nanami (Japan), Michal (Poland & the UK), and Lucy (Uxbridge, UK) and compare their school memories.</p>
        <h3>Grammar: Past Simple (Regular Verbs)</h3>
        <p>Master affirmative and negative statements with regular verbs: <em>I lived in a village</em> / <em>I didn't live in a city</em>.</p>
        <p>Learn spelling rules for <em>-ed</em> forms: <em>walk &rarr; walked</em>, <em>like &rarr; liked</em>, <em>study &rarr; studied</em>, <em>travel &rarr; travelled</em>.</p>
        <h3>Pronunciation: Regular Past Simple Endings</h3>
        <p>Practice the three distinct sounds for <em>-ed</em>: /t/ (worked, watched, cooked), /d/ (stayed, played), and /ɪd/ (started, visited, wanted).</p>
        <h3>Speaking: Childhood Memories</h3>
        <p>Prepare and deliver a short talk about your early childhood, hometown, school, and hobbies, and record a voice summary with AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> give a talk about when you were young.<br/>
        <strong>Grammar:</strong> past simple (regular verbs).<br/>
        <strong>Vocabulary:</strong> verb phrases.</p>
        <h4>Past Simple: Regular Verbs</h4>
        <p>Use the past simple for finished actions and situations in the past.</p>
        <ul>
          <li><strong>Positive (+):</strong> Subject + verb-ed (<em>I/You/He/She/It/We/They lived in a village.</em>)</li>
          <li><strong>Negative (&minus;):</strong> Subject + didn't + base verb (<em>I/You/He/She/It/We/They didn't live in a city.</em>)</li>
        </ul>
        <h4>Spelling Rules for -ed</h4>
        <ul>
          <li><strong>Most verbs:</strong> add <em>-ed</em> (<em>walk &rarr; walked</em>, <em>play &rarr; played</em>).</li>
          <li><strong>Verbs ending in -e:</strong> add <em>-d</em> (<em>like &rarr; liked</em>, <em>live &rarr; lived</em>).</li>
          <li><strong>Verbs ending in consonant + -y:</strong> change <em>-y</em> to <em>-ied</em> (<em>study &rarr; studied</em>).</li>
          <li><strong>Verbs ending in one vowel + one consonant:</strong> double the consonant + <em>-ed</em> (<em>travel &rarr; travelled</em>, <em>stop &rarr; stopped</em>).</li>
        </ul>
        <h4>Pronunciation of -ed</h4>
        <ul>
          <li><strong>/t/:</strong> after voiceless sounds /k, p, s, ʃ, tʃ/ (<em>worked, watched, cooked</em>).</li>
          <li><strong>/d/:</strong> after voiced sounds /b, g, v, z, m, n, l/ and vowels (<em>stayed, played, cleaned</em>).</li>
          <li><strong>/ɪd/:</strong> after /t/ or /d/ sounds, adding an extra syllable (<em>started, visited, wanted</em>).</li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1b_photo_match: {
        match: ['B', 'b', 'Photo B', 'photo b'],
      },
      exercise_2a_word_map: {
        travel_1: ['to school', 'to school by bus', 'school'],
        watch_1: ['a game on the computer', 'game on the computer', 'a game', 'games'],
        live_1: ['in a village', 'village', 'a village', 'in a village in Norway'],
        play_1: ['football', 'Football', 'football every day'],
        talk_1: ['to my friends', 'friends', 'to friends'],
        talk_2: ['about football', 'football'],
      },
      exercise_3a_word_map: {
        live_1: ['in a town', 'a town', 'town'],
        live_2: ['with my family', 'my family', 'family'],
        live_3: ['in a house', 'a house', 'house'],
        talk_1: ['to my teacher', 'my teacher', 'teacher'],
        talk_2: ['about my weekend', 'my weekend', 'weekend'],
        watch_1: ['a film', 'film', 'films'],
        play_1: ['tennis', 'Tennis'],
        travel_1: ["to my grandparents' house", 'to my grandparents house', "grandparents' house", 'grandparents house'],
        travel_2: ['by car', 'car'],
      },
      exercise_5_table: {
        '1_nanami': ['false'],
        '1_michal': ['false'],
        '1_lucy': ['true'],
        '2_nanami': ['true'],
        '2_michal': ['false'],
        '2_lucy': ['false'],
        '3_nanami': ['false'],
        '3_michal': ['true'],
        '3_lucy': ['false'],
        '4_nanami': ['true'],
        '4_michal': ['true'],
        '4_lucy': ['false'],
        '5_nanami': ['false'],
        '5_michal': ['true'],
        '5_lucy': ['false'],
      },
      exercise_5_reading_table: {
        liked_school: ['Lucy', 'lucy'],
        travelled_every_year: ['Nanami', 'nanami'],
        went_to_new_country: ['Michal', 'michal'],
        lived_in_small_place: ['Nanami and Michal', 'Nanami, Michal', 'Nanami & Michal', 'Michal and Nanami', 'Nanami', 'Michal'],
        doesnt_talk_about_games: ['Michal', 'michal'],
      },
      exercise_6_grammar: {
        '1': ['walked', 'Walked'],
        '2': ['liked', 'Liked'],
        '3': ['studied', 'Studied'],
        '4': ['travelled', 'traveled', 'Travelled', 'Traveled'],
      },
      exercise_7c_pronunciation: {
        '1': ['c', 'C', '/ɪd/', 'id', '/id/'],
        '2': ['b', 'B', '/d/', 'd'],
        '3': ['a', 'A', '/t/', 't'],
        '4': ['a', 'A', '/t/', 't'],
        '5': ['c', 'C', '/ɪd/', 'id', '/id/'],
      },
      exercise_8a_sentences: {
        '1': ['started', 'Started'],
        '2': ['travelled', 'traveled', 'Travelled', 'Traveled'],
        '3': ['cleaned', 'Cleaned'],
        '4': ["didn't like", 'did not like', 'didnt like'],
        '5': ['played', 'Played'],
        '6': ['studied', 'Studied'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 8B: You had a bad day
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380802',
    title: '8B You had a bad day',
    order: 30,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Common Irregular Verbs</h3>
        <p>Master 14 essential irregular verbs in base and past simple forms: <em>get up &rarr; got up</em>, <em>break &rarr; broke</em>, <em>take &rarr; took</em>, <em>buy &rarr; bought</em>, <em>meet &rarr; met</em>, <em>lose &rarr; lost</em>, <em>feel &rarr; felt</em>, <em>speak &rarr; spoke</em>, <em>have &rarr; had</em>, <em>go &rarr; went</em>, <em>run &rarr; ran</em>, <em>eat &rarr; ate</em>, <em>forget &rarr; forgot</em>, <em>see &rarr; saw</em>.</p>
        <h3>Comic Story: A Really Bad Day (Panels A–L)</h3>
        <p>Follow a comic sequence illustrating chaotic events from waking up late to a broken computer and missing a movie.</p>
        <h3>Reading: Carla's Day</h3>
        <p>Read about Carla's exhausting day at work, identify what she did and didn't do, and match with photo evidence.</p>
        <h3>Grammar: Past Simple (Irregular Verbs & Negatives)</h3>
        <p>Understand how irregular verbs change forms in affirmative sentences and how to form negatives with <em>didn't + infinitive</em>: <em>I went to work</em> &rarr; <em>I didn't go to work</em>.</p>
        <h3>Pronunciation: The Silent /t/ in <em>didn't</em></h3>
        <p>Notice connected speech pronunciation where the final /t/ of <em>didn't</em> is elided before consonants (<em>I didn't buy</em> /aɪ ˈdɪdn baɪ/).</p>
        <h3>Speaking: A Bad Day Story</h3>
        <p>Make notes about a real or imagined bad day (When? Where? What happened?) and narrate your experience using AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about a bad day.<br/>
        <strong>Grammar:</strong> past simple (irregular verbs).<br/>
        <strong>Vocabulary:</strong> irregular verbs.</p>
        <h4>Past Simple: Irregular Verbs</h4>
        <p>Many common verbs have irregular past simple forms that must be memorized:</p>
        <ul>
          <li><em>break &rarr; broke</em></li>
          <li><em>buy &rarr; bought</em></li>
          <li><em>eat &rarr; ate</em></li>
          <li><em>feel &rarr; felt</em></li>
          <li><em>forget &rarr; forgot</em></li>
          <li><em>get up &rarr; got up</em></li>
          <li><em>go &rarr; went</em></li>
          <li><em>have &rarr; had</em></li>
          <li><em>lose &rarr; lost</em></li>
          <li><em>meet &rarr; met</em></li>
          <li><em>run &rarr; ran</em></li>
          <li><em>see &rarr; saw</em></li>
          <li><em>speak &rarr; spoke</em></li>
          <li><em>take &rarr; took</em></li>
        </ul>
        <h4>Negative Forms with Irregular Verbs</h4>
        <p>To make the negative in the past simple, use <strong>didn't + base form (infinitive)</strong>. The main verb does NOT change to past form:</p>
        <ul>
          <li>Positive: <em>I went to work.</em></li>
          <li>Negative: <em>I <strong>didn't go</strong> to work.</em> (NOT <s>didn't went</s>)</li>
          <li>Positive: <em>He ate soup.</em></li>
          <li>Negative: <em>He <strong>didn't eat</strong> soup.</em> (NOT <s>didn't ate</s>)</li>
        </ul>
        <h4>Pronunciation of <em>didn't</em></h4>
        <p>In natural fluent English, the final /t/ sound of <em>didn't</em> is usually silent before another consonant: <em>I didn't buy</em> sounds like <em>I didn' buy</em>.</p>
      </div>
    `,
    answerKey: {
      exercise_1a_mood: {
        day_type: ['a bad day', 'bad day', 'bad', 'A bad day'],
      },
      exercise_1b_order: {
        '1': ['C', 'c'],
        '2': ['A', 'a', 'B', 'b'],
        '3': ['B', 'b', 'A', 'a'],
        '4': ['F', 'f', 'J', 'j'],
        '5': ['J', 'j', 'F', 'f', 'G', 'g'],
        '6': ['G', 'g', 'H', 'h'],
        '7': ['H', 'h', 'E', 'e'],
        '8': ['E', 'e', 'K', 'k'],
        '9': ['K', 'k', 'L', 'l'],
        '10': ['L', 'l', 'I', 'i'],
        '11': ['I', 'i', 'D', 'd'],
        '12': ['D', 'd'],
      },
      exercise_2a_matching: {
        break: ['broke', 'Broke'],
        take: ['took', 'Took'],
        buy: ['bought', 'Bought'],
        meet: ['met', 'Met'],
        lose: ['lost', 'Lost'],
        feel: ['felt', 'Felt'],
        speak: ['spoke', 'Spoke'],
        have: ['had', 'Had'],
        go: ['went', 'Went'],
        run: ['ran', 'Ran'],
        eat: ['ate', 'Ate'],
        forget: ['forgot', 'Forgot'],
        see: ['saw', 'Saw'],
      },
      exercise_2b_sentences: {
        '1': ['saw', 'Saw'],
        '2': ['felt', 'Felt'],
        '3': ['took', 'Took'],
        '4': ['went', 'Went'],
        '5': ['ate', 'Ate'],
        '6': ['met', 'Met'],
        '7': ['forgot', 'Forgot'],
        '8': ['lost', 'Lost'],
        '9': ['spoke', 'Spoke'],
        '10': ['bought', 'Bought'],
      },
      exercise_3a_carla_photo: {
        match: ['B', 'b', 'Photo B', 'photo b'],
      },
      exercise_3b_carla_actions: {
        '1': ["didn't have time for breakfast", "didn't have breakfast", 'did not have time for breakfast', "didn't have time"],
        '2': ["didn't speak to colleagues", "didn't speak to my colleagues", "didn't speak"],
        '3': ["didn't buy lunch", 'did not buy lunch'],
        '4': ["didn't eat anything", 'did not eat anything'],
        '5': ['worked', 'worked and worked and worked', 'Worked'],
        '6': ["didn't walk home", 'did not walk home'],
        '7': ['took the train', 'Took the train'],
        '8': ['ate chips', 'Ate chips'],
        '9': ['watched TV', 'Watched TV'],
        '10': ["forgot mum's birthday", "forgot her mum's birthday", 'forgot mums birthday', "didn't remember mum's birthday"],
      },
      exercise_4_grammar: {
        '1': ['-ed', 'ed'],
        '2': ["didn't", 'did not', 'didnt'],
      },
      exercise_5a_pronunciation: {
        silent_letter: ['t', 'T', 'the letter t', 'letter t'],
      },
      exercise_6_text_completion: {
        '2': ['had', 'Had'],
        '3': ['felt', 'Felt'],
        '4': ['met', 'Met'],
        '5': ['went', 'Went'],
        '6': ['ran', 'Ran'],
        '7': ['had', 'Had'],
        '8': ['spoke', 'Spoke'],
        '9': ["didn't take", 'did not take', 'didnt take'],
        '10': ["didn't go", 'did not go', 'didnt go'],
        '11': ["didn't see", 'did not see', 'didnt see'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 8C: Good places
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380803',
    title: '8C Good places',
    order: 31,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Holiday Activities</h3>
        <p>Learn common expressions for holidays: <em>have a good time</em>, <em>relax</em>, <em>go shopping</em>, <em>visit a museum</em>, <em>stay in a hotel</em>, <em>go for a walk</em>, <em>go to restaurants</em>, <em>swim in the sea</em>.</p>
        <h3>Listening: Megan's Holiday</h3>
        <p>Listen to Megan talking about her holiday in Greece (Audio 8.9) and identify the questions asked.</p>
        <h3>Grammar: Past Simple (Questions)</h3>
        <p>Form Yes/No and Wh- questions in the past simple using <em>Did + subject + base verb</em>.</p>
        <h3>Pronunciation: Connected Speech in Questions</h3>
        <p>Notice how words link together in natural speech: <em>Did you</em> /dɪdʒu/ in questions (Audio 8.10).</p>
        <h3>Speaking: Talk About a Holiday</h3>
        <p>Form questions about past holidays, prepare notes about your favourite holiday, and narrate your experience using AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about a holiday.<br/>
        <strong>Grammar:</strong> past simple (questions).<br/>
        <strong>Vocabulary:</strong> holiday activities.</p>
        <h4>Past Simple Questions</h4>
        <p>To form questions in the past simple, use the auxiliary verb <strong>did</strong> + <strong>subject</strong> + <strong>base verb (infinitive)</strong>:</p>
        <h5>Yes/No Questions</h5>
        <ul>
          <li><em>Did you have a good weekend?</em> &rarr; <strong>Yes, I did.</strong> / <strong>No, I didn't.</strong></li>
          <li><em>Did they have fun?</em> &rarr; <strong>Yes, they did.</strong> / <strong>No, they didn't.</strong></li>
        </ul>
        <h5>Wh- Questions</h5>
        <ul>
          <li><strong>Where</strong> did Emily go?</li>
          <li><strong>When</strong> did she visit Tokyo?</li>
          <li><strong>How</strong> did you get there?</li>
          <li><strong>What</strong> did you do?</li>
          <li><strong>Who</strong> did you go with?</li>
        </ul>
        <p><em>Important:</em> The main verb stays in the base form (infinitive), NOT in the past form: <em>Where did you go?</em> (NOT <s>Where did you went?</s>).</p>
        <h4>Pronunciation: Linking "Did you"</h4>
        <p>In spoken English, <em>did you</em> is usually pronounced as one connected unit: /dɪdʒu/ or /dɪd jʊ/.</p>
      </div>
    `,
    answerKey: {
      exercise_1a_photos: {
        photo_a: ['have a good time', 'Have a good time'],
        photo_b: ['relax', 'Relax'],
        photo_c: ['go shopping', 'Go shopping'],
        photo_d: ['visit a museum', 'Visit a museum'],
        photo_e: ['stay in a hotel', 'Stay in a hotel'],
        photo_f: ['go for a walk', 'Go for a walk'],
        photo_g: ['go to restaurants', 'Go to restaurants'],
        photo_h: ['swim in the sea', 'Swim in the sea'],
      },
      exercise_2a_present_tense: {
        relaxed: ['relax', 'Relax'],
        swam: ['swim', 'Swim'],
        visited: ['visit', 'Visit'],
        went: ['go', 'Go'],
        stayed: ['stay', 'Stay'],
      },
      exercise_2b_irregular: {
        had: ['irregular', 'true'],
        relaxed: ['regular', 'false'],
        swam: ['irregular', 'true'],
        visited: ['regular', 'false'],
        went: ['irregular', 'true'],
        stayed: ['regular', 'false'],
      },
      exercise_3a_topic: {
        topic: ['her holiday', 'holiday', 'holiday in Greece', 'Her holiday'],
      },
      exercise_3b_tick_questions: {
        '1': ['true'],
        '2': ['true'],
        '3': ['false'],
        '4': ['true'],
        '5': ['true'],
        '6': ['false'],
      },
      exercise_4_grammar_box: {
        '1': ['Did', 'did'],
        '2': ['Did', 'did'],
        '3': ['did', 'Did'],
        '4': ['did', 'Did'],
        '5': ['did', 'Did'],
        '6': ['did', 'Did'],
      },
      exercise_6a_make_questions: {
        '2': ['What time did you get up on Saturday?', 'What time did you get up on Saturday'],
        '3': ['Where did you go?', 'Where did you go'],
        '4': ['Who did you go with?', 'Who did you go with'],
        '5': ['Where did you have lunch on Sunday?', 'Where did you have lunch on Sunday'],
        '6': ['What did you eat?', 'What did you eat'],
        '7': ['What did you do in the evening?', 'What did you do in the evening'],
        '8': ['Did you study English?', 'Did you study English'],
        '9': ['Did your best friend text you?', 'Did your best friend text you'],
      },
      exercise_7a_prepare_questions: {
        where: ['Where did you go?', 'Where did you go'],
        when: ['When did you go?', 'When did you go'],
        how: ['How did you get there?', 'How did you get there'],
        who: ['Who did you go with?', 'Who did you go with'],
        food: ['What food did you eat?', 'What food did you eat'],
        what: ['What did you do?', 'What did you do'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 8D: English in action & Check and reflect
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380804',
    title: '8D English in action',
    order: 32,
    content: `
      <div class="lesson-section">
        <h3>Useful Phrases: Greetings & Weekend Catch-Up</h3>
        <p>Learn natural phrases to start conversations, ask greetings, answer greetings, and end conversations politely.</p>
        <h3>Listening & Roleplay</h3>
        <p>Listen to conversations at a train station and outside university (Audio 8.15), practice greetings (Audio 8.16), and record oral dialogues with AudioAnswerRecorder.</p>
        <h3>Check and Reflect (Unit 8 Review)</h3>
        <p>Review past simple regular and irregular verbs, verb collocations, wordsearch puzzle, and self-assessment 1–5.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> greet people.<br/>
        <strong>Speaking:</strong> conversations about the weekend.<br/>
        <strong>Review:</strong> Unit 8 grammar, vocabulary, and pronunciation.</p>
        <h4>Useful Phrases: Greet People</h4>
        <h5>Starting a Conversation</h5>
        <ul>
          <li><em>Hello / Hi, (Mike).</em></li>
          <li><em>Good morning / afternoon / evening, (Erica).</em></li>
        </ul>
        <h5>Questions for Greetings</h5>
        <ul>
          <li><em>How are you?</em></li>
          <li><em>How are things?</em></li>
          <li><em>Are you OK?</em></li>
        </ul>
        <h5>Answers for Greetings</h5>
        <ul>
          <li><em>(I'm) OK, thank you. (And you?)</em></li>
          <li><em>(I'm) not bad, thanks. (And you?)</em></li>
          <li><em>(I'm) great, thanks. (And you?)</em></li>
          <li><em>(I'm) very well, thank you. (And you?)</em></li>
          <li><em>(I'm) fine, thanks. (And you?)</em></li>
          <li><em>(I'm) good, thank you. (And you?)</em></li>
        </ul>
        <h5>Ending a Conversation</h5>
        <ul>
          <li><em>Goodbye / Bye.</em></li>
          <li><em>See you / See you later.</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1b_conversations: {
        conv_1: ['A', 'a', 'Photo A', 'photo a'],
        conv_2: ['B', 'b', 'Photo B', 'photo b'],
      },
      exercise_1c_activities: {
        sara: ['stayed at home', 'stayed at home and watched TV', 'watched TV', 'stayed at home, watched TV'],
        mike: ['visited parents', 'had lunch with parents', 'had lunch with his parents'],
        erica: ['visited a friend', 'visited friend'],
        duncan: ['cleaned flat', 'cleaned his flat', 'cleaned his apartment'],
      },
      exercise_3a_conversations: {
        '1': ['Good morning', 'good morning', 'Hello', 'hello', 'Hi', 'hi'],
        '2': ['Not bad, thanks', 'not bad, thanks', 'Not bad, thank you', "I'm fine, thanks", 'Fine, thanks', 'Great, thanks'],
        '3': ['Goodbye', 'goodbye', 'Bye', 'bye', 'See you', 'see you', 'See you later', 'see you later'],
        '4': ['Hi', 'hi', 'Hello', 'hello'],
        '5': ["I'm fine, thanks", 'fine, thanks', "I'm OK, thanks", 'Good, thanks', 'Very well, thank you', 'Great, thanks'],
        '6': ['See you later', 'see you later', 'See you', 'see you', 'Bye', 'bye', 'Goodbye', 'goodbye'],
      },
      check_ex1a_verbs: {
        '1': ['live', 'Live'],
        '2': ['play', 'Play'],
        '3': ['talk', 'Talk'],
        '4': ['watch', 'Watch'],
        '5': ['travel', 'Travel'],
      },
      check_ex2_past_regular: {
        '2': ['travelled', 'traveled', 'Travelled', 'Traveled'],
        '3': ['cycled', 'Cycled'],
        '4': ['arrived', 'Arrived'],
        '5': ['started', 'Started'],
        '6': ['studied', 'Studied'],
        '7': ['played', 'Played'],
        '8': ['liked', 'Liked'],
        '9': ["didn't like", 'did not like', 'didnt like'],
        '10': ['finished', 'Finished'],
      },
      check_ex3_wordsearch: {
        ate: ['true'],
        broke: ['true'],
        felt: ['true'],
        forgot: ['true'],
        got_up: ['true'],
        had: ['true'],
        lost: ['true'],
        met: ['true'],
        ran: ['true'],
        spoke: ['true'],
        took: ['true'],
        went: ['true'],
      },
      check_ex4_sentences: {
        '1': ['forgot', 'Forgot'],
        '2': ['spoke', 'Spoke'],
        '3': ['bought', 'Bought'],
        '4': ['got up', 'Got up'],
        '5': ['met', 'Met'],
        '6': ['broke', 'Broke'],
      },
      check_ex5a_sentences: {
        '2': ['had', 'Had'],
        '3': ['made', 'Made'],
        '4': ['ate', 'Ate'],
        '5': ['drank', 'Drank'],
        '6': ['bought', 'Bought'],
        '7': ['read', 'Read'],
        '8': ['took', 'Took'],
      },
      check_ex6_infinitives: {
        '1': ['swim', 'Swim'],
        '2': ['visit', 'Visit'],
        '3': ['go', 'Go'],
        '4': ['have', 'Have'],
        '5': ['stay', 'Stay'],
      },
      check_ex7a_questions: {
        '2': ['Did you have', 'did you have'],
        '3': ['did you travel', 'did you get', 'did you go'],
        '4': ['Did you watch', 'did you watch'],
        '5': ['Did you speak', 'did you speak', 'Did you talk', 'did you talk'],
        '6': ['did you have', 'did you eat'],
      },
    },
    unit,
  });
}
