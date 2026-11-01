import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit9(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  // ----------------------------------------------------
  // Lesson 9A: Family photos
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380901',
    title: '9A Family photos',
    order: 33,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Prepositions of Place</h3>
        <p>Learn prepositions of place with everyday objects: <em>at, below, in, next to, in front of, on, above, between, behind</em>.</p>
        <h3>Listening: Family Portrait</h3>
        <p>Listen to Tony and Camilla discussing a multi-generational family photo and identify family members: Tony, Agnes, Carol, and Pat.</p>
        <h3>Grammar: Object Pronouns</h3>
        <p>Master object pronouns: <em>me, you, him, her, it, us, them</em>. Learn when to use subject pronouns before verbs and object pronouns after verbs and prepositions.</p>
        <h3>Pronunciation: Weak Form of Object Pronouns</h3>
        <p>Notice how object pronouns are unstressed and pronounced in their weak forms in connected speech.</p>
        <h3>Speaking: Describing Family & Friends</h3>
        <p>Prepare notes and talk about family or friends in a photograph, asking and answering questions with AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about the people in a photo.<br/>
        <strong>Grammar:</strong> object pronouns (<em>me, him, her, etc.</em>).<br/>
        <strong>Vocabulary:</strong> prepositions of place.</p>
        
        <h4>Prepositions of Place</h4>
        <ul>
          <li><strong>on:</strong> The bag is <em>on</em> the table.</li>
          <li><strong>in:</strong> The flowers are <em>in</em> the bag.</li>
          <li><strong>at:</strong> The man is <em>at</em> the hotel.</li>
          <li><strong>next to:</strong> The bag is <em>next to</em> the chair.</li>
          <li><strong>above:</strong> The picture is <em>above</em> the table.</li>
          <li><strong>below:</strong> The table is <em>below</em> the picture.</li>
          <li><strong>between:</strong> The clock is <em>between</em> the computer and the books.</li>
          <li><strong>in front of:</strong> The cup is <em>in front of</em> the cake.</li>
          <li><strong>behind:</strong> The cake is <em>behind</em> the cup.</li>
        </ul>

        <h4>Object Pronouns</h4>
        <p>We use subject pronouns <strong>before</strong> the main verb as the subject of the sentence:</p>
        <p><em><strong>I</strong> live in London. <strong>They</strong> live in Acapulco.</em></p>
        <p>We use object pronouns <strong>after</strong> the verb or after prepositions:</p>
        <p><em>My parents visit <strong>me</strong> at the weekend. Do you often talk to <strong>them</strong>?</em></p>

        <table class="theory-table">
          <thead>
            <tr>
              <th>Subject Pronouns</th>
              <th>Object Pronouns</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>I</td><td>me</td></tr>
            <tr><td>you</td><td>you</td></tr>
            <tr><td>he</td><td>him</td></tr>
            <tr><td>she</td><td>her</td></tr>
            <tr><td>it</td><td>it</td></tr>
            <tr><td>we</td><td>us</td></tr>
            <tr><td>they</td><td>them</td></tr>
          </tbody>
        </table>
      </div>
    `,
    answerKey: {
      exercise_1b_prepositions: {
        '1': ['C', 'c', 'Photo C', 'photo c'],
        '2': ['F', 'f', 'Photo F', 'photo f'],
        '3': ['B', 'b', 'Photo B', 'photo b'],
        '4': ['D', 'd', 'Photo D', 'photo d'],
        '5': ['H', 'h', 'Photo H', 'photo h'],
        '6': ['A', 'a', 'Photo A', 'photo a'],
        '7': ['E', 'e', 'Photo E', 'photo e'],
        '8': ['G', 'g', 'Photo G', 'photo g'],
        '9': ['I', 'i', 'Photo I', 'photo i'],
      },
      exercise_3a_labels: {
        '1': ['Tony', 'tony'],
        '2': ['Carol', 'carol'],
        '3': ['Agnes', 'agnes'],
        '4': ['Pat', 'pat'],
      },
      exercise_3b_speakers: {
        a: ['T', 't', 'Tony', 'tony'],
        b: ['C', 'c', 'Camilla', 'camilla'],
        c: ['T', 't', 'Tony', 'tony'],
        d: ['C', 'c', 'Camilla', 'camilla'],
        e: ['T', 't', 'Tony', 'tony'],
      },
      exercise_3c_referents: {
        '1': ['Tony', 'tony'],
        '2': ['Tony', 'tony'],
        '3': [
          'Tony and Carol',
          'Tony and his wife',
          'Tony and his wife Carol',
          'Tony, Carol',
          'Carol and Tony',
        ],
        '4': ["Tony's sister", 'his sister', 'sister', 'Tony sister'],
        '5': [
          "Tony's sister's family",
          'his sister and her family',
          "Tony's sister and her family",
          'sister and her family',
          'his sister family',
        ],
        '6': ['Pat', 'pat', "Tony's brother-in-law", "sister's husband"],
      },
      exercise_4_rules: {
        rule_1: ['before', 'Before'],
        rule_2: ['after', 'After'],
      },
      exercise_4_pronouns_table: {
        pronoun_i: ['me'],
        pronoun_you: ['you'],
        pronoun_he: ['him'],
        pronoun_she: ['her'],
        pronoun_it: ['it'],
        pronoun_we: ['us'],
        pronoun_they: ['them'],
      },
      exercise_5a_stress: {
        '1': ['unstressed', 'Unstressed'],
        '2': ['unstressed', 'Unstressed'],
        '3': ['unstressed', 'Unstressed'],
      },
      exercise_6_alternatives: {
        '1': ['They', 'they'],
        '2': ['them', 'Them'],
        '3': ['I', 'i'],
        '4': ['I', 'i'],
        '5': ['her', 'Her'],
        '6': ['him', 'Him'],
        '7': ['us', 'Us'],
        '8': ['him', 'Him'],
        '9': ['She', 'she'],
        '10': ['She', 'she'],
        '11': ['me', 'Me'],
        '12': ['we', 'We'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 9B: Hobbies
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380902',
    title: '9B Hobbies',
    order: 34,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Hobbies & Collocations</h3>
        <p>Learn core hobby activities and collocations: <em>do exercise, listen to music, play cards, use the internet, read a book, watch a film, watch a play, watch a TV programme, play a game, listen to the radio, read a newspaper, do/play some sport, play a video game, listen to a song, read/listen to a story</em>.</p>
        <h3>Listening: Weekend Activities</h3>
        <p>Listen to interviews with Tania and Kristoff talking about what they love, like/enjoy, don't like, and hate doing at the weekend.</p>
        <h3>Grammar: like / enjoy / love / hate + -ing</h3>
        <p>Master verb patterns expressing likes and dislikes with the <em>-ing</em> form: <em>I love running in the park</em>, <em>He doesn't like watching TV</em>, <em>Do you like reading books?</em></p>
        <h3>Pronunciation: The -ing Ending</h3>
        <p>Practice pronouncing the weak, unstressed nasal sound /ɪŋ/ in connected speech.</p>
        <h3>Speaking: Entertainment Survey</h3>
        <p>Prepare an entertainment survey asking about favorite leisure activities, interview a partner, and record a spoken summary with AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about things you and I like doing.<br/>
        <strong>Grammar:</strong> like / enjoy / love / hate + <em>-ing</em>.<br/>
        <strong>Vocabulary:</strong> hobbies.</p>

        <h4>Verbs of Preference + -ing</h4>
        <p>When verbs such as <strong>like</strong>, <strong>enjoy</strong>, <strong>love</strong>, and <strong>hate</strong> are followed by an action, the second verb takes the <strong>-ing</strong> form:</p>
        <ul>
          <li><strong>love (+ +):</strong> <em>I love running in the park. She loves cooking.</em></li>
          <li><strong>like / enjoy (+):</strong> <em>I enjoy going to restaurants. We like walking the dog.</em></li>
          <li><strong>don't like (&minus;):</strong> <em>I don't like watching TV. He doesn't like losing.</em></li>
          <li><strong>hate (&minus; &minus;):</strong> <em>Tania hates reading books. Kristoff hates playing video games.</em></li>
        </ul>

        <h4>Questions and Short Answers</h4>
        <ul>
          <li><strong>Yes/No Questions:</strong> <em>Do you like playing cards? &mdash; Yes, I do. / No, I don't.</em></li>
          <li><em>Does she like doing exercise? &mdash; Yes, she does. / No, she doesn't.</em></li>
          <li><strong>Wh- Questions:</strong> <em>What do you like doing at the weekend?</em></li>
        </ul>

        <h4>Spelling Rules for the -ing Form</h4>
        <ul>
          <li><strong>Most verbs:</strong> verb + <em>-ing</em> (<em>do &rarr; doing</em>, <em>read &rarr; reading</em>, <em>watch &rarr; watching</em>).</li>
          <li><strong>Verbs ending in -e:</strong> drop the final <em>-e</em> + <em>-ing</em> (<em>make &rarr; making</em>, <em>write &rarr; writing</em>, <em>dance &rarr; dancing</em>).</li>
          <li><strong>Verbs ending in one vowel + one consonant:</strong> double the consonant + <em>-ing</em> (<em>travel &rarr; travelling</em>, <em>run &rarr; running</em>, <em>swim &rarr; swimming</em>).<br/>
          <em>Exception:</em> when stress is not on the last syllable (e.g., <em>visit &rarr; visiting</em>).</li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['B', 'b', 'Photo B', 'photo b'],
        '2': ['A', 'a', 'Photo A', 'photo a'],
        '3': ['F', 'f', 'Photo F', 'photo f'],
        '4': ['D', 'd', 'Photo D', 'photo d'],
        '5': ['C', 'c', 'Photo C', 'photo c'],
        '6': ['E', 'e', 'Photo E', 'photo e'],
      },
      exercise_2a_collocations: {
        '1': ['watch', 'Watch'],
        '2': ['watch', 'Watch'],
        '3': ['play', 'Play'],
        '4': ['listen to', 'Listen to'],
        '5': ['read', 'Read'],
        '6_1': ['do', 'Do', 'play', 'Play'],
        '6_2': ['play', 'Play', 'do', 'Do'],
        '7': ['play', 'Play'],
        '8': ['listen to', 'Listen to'],
        '9_1': ['read', 'Read', 'listen to', 'Listen to'],
        '9_2': ['listen to', 'Listen to', 'read', 'Read'],
      },
      exercise_3_sentences: {
        '1': ['read', 'Read'],
        '2': ['listen', 'Listen'],
        '3': ['play', 'Play'],
        '4': ['played', 'Played'],
        '5': ['watched', 'Watched'],
        '6': ['read', 'Read'],
        '7': ['uses', 'Uses'],
        '8': ['watch', 'Watch'],
      },
      exercise_5a_tables: {
        tania_restaurants: ['likes/enjoys', 'enjoys', 'likes'],
        tania_books: ['hates'],
        tania_running: ['loves'],
        kristoff_dog: ['likes/enjoys', 'likes', 'enjoys'],
        kristoff_tv: ["doesn't like", 'does not like', 'doesnt like'],
        kristoff_games: ['hates'],
      },
      exercise_5b_options: {
        '1': ['a', 'A', 'friends'],
        '2': ['b', 'B', 'sports'],
        '3': ['b', 'B', 'running'],
        '4': ['a', 'A', 'in the park'],
        '5': ['a', 'A', 'watching TV'],
        '6': ['b', 'B', 'playing video games'],
      },
      exercise_6_grammar: {
        '1': ['walking', 'Walking'],
        '2': ['watching', 'Watching'],
        '3': ['reading', 'Reading'],
        '4': ['running', 'Running'],
        '5': ['reading', 'Reading'],
        '6': ['doing', 'Doing'],
        '7': ['doing', 'Doing'],
        '8': ['doing', 'Doing'],
      },
      exercise_8_sentences: {
        '1': ['staying', 'Staying'],
        '2': ['making', 'Making'],
        '3': ['studying', 'Studying'],
        '4': ['cleaning', 'Cleaning'],
        '5': ['travelling', 'traveling', 'Travelling', 'Traveling'],
        '6': ['eating', 'Eating'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 9C: Study habits
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380903',
    title: '9C Study habits',
    order: 35,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Learning a Language</h3>
        <p>Master 12 core study actions and collocations: <em>write on the board, take a course, use a dictionary, take an exam, do my homework, go to the library, make notes, do online practice, pass an exam, fail an exam, know the answer, can't remember a word</em>.</p>
        <h3>Reading: Because ... (Bianca Costa)</h3>
        <p>Read an authentic profile about Bianca Costa's reasons for studying English, her challenges, exam preparations, and why she loves her teacher.</p>
        <h3>Grammar: why and because</h3>
        <p>Learn how to ask for reasons using <em>Why...?</em> across different verb structures (<em>Why + be</em>, <em>Why + do/did</em>, <em>Why + have got</em>) and give explanations using <em>because</em>.</p>
        <h3>Pronunciation: Linking and Weak Form of because</h3>
        <p>Listen and repeat sentences noticing the weak, linked pronunciation of <em>because</em> (/bɪˈkəz/ or /bɪˈkɒz/) in fluent speech.</p>
        <h3>Speaking: Study Habits Interview</h3>
        <p>Formulate questions about language study habits, interview a partner, give reasons with <em>because</em>, and record your spoken answers for teacher review.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about study habits.<br/>
        <strong>Grammar:</strong> <em>why</em> and <em>because</em>.<br/>
        <strong>Vocabulary:</strong> learning a language.</p>

        <h4>Asking for Reasons with Why</h4>
        <p>We use <strong>Why</strong> at the beginning of a question when we want to know the reason for something:</p>
        <ul>
          <li><strong>Why + be:</strong> <em>Why <strong>is</strong> English difficult for you? Why <strong>are</strong> you late?</em></li>
          <li><strong>Why + do/does/did + subject + verb:</strong><br/>
            <em>Why <strong>do you study</strong> English?</em><br/>
            <em>Why <strong>didn't you study</strong> English at school?</em><br/>
            <em>Why <strong>does he go</strong> to the library?</em>
          </li>
          <li><strong>Why + have + subject + got:</strong><br/>
            <em>Why <strong>have you got</strong> four lessons this week?</em>
          </li>
        </ul>

        <h4>Giving Reasons with Because</h4>
        <p>We use <strong>because</strong> to give the reason for something:</p>
        <ul>
          <li><strong>Statement + because + reason:</strong><br/>
            <em>Bianca studies English <strong>because</strong> she uses it for her work.</em><br/>
            <em>English is difficult <strong>because</strong> I can't remember all the words.</em>
          </li>
          <li><strong>In short answers to questions with Why:</strong><br/>
            <em>&mdash; Why do you study here?<br/>
            &mdash; <strong>Because</strong> the teacher is very good.</em>
          </li>
        </ul>

        <h4>Vocabulary: Study Habits Collocations</h4>
        <table class="theory-table">
          <thead>
            <tr>
              <th>Phrase</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>take a course</strong></td><td>I take an English course at the university.</td></tr>
            <tr><td><strong>take an exam</strong></td><td>All students take exams in June.</td></tr>
            <tr><td><strong>pass an exam</strong></td><td>She got 90% and passed the exam.</td></tr>
            <tr><td><strong>fail an exam</strong></td><td>He didn't study, so he failed the exam.</td></tr>
            <tr><td><strong>use a dictionary</strong></td><td>You can use an online dictionary for difficult words.</td></tr>
            <tr><td><strong>make notes</strong></td><td>I always make notes in my notebook during lessons.</td></tr>
            <tr><td><strong>write on the board</strong></td><td>The teacher writes new words on the board.</td></tr>
            <tr><td><strong>do online practice</strong></td><td>I do online practice on my smartphone every day.</td></tr>
          </tbody>
        </table>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['D', 'd', 'Photo D', 'photo d'],
        '2': ['G', 'g', 'Photo G', 'photo g'],
        '3': ['J', 'j', 'Photo J', 'photo j'],
        '4': ['B', 'b', 'Photo B', 'photo b'],
        '5': ['L', 'l', 'Photo L', 'photo l'],
        '6': ['A', 'a', 'Photo A', 'photo a'],
        '7': ['H', 'h', 'Photo H', 'photo h'],
        '8': ['K', 'k', 'Photo K', 'photo k'],
        '9': ['F', 'f', 'Photo F', 'photo f'],
        '10': ['C', 'c', 'Photo C', 'photo c'],
        '11': ['E', 'e', 'Photo E', 'photo e'],
        '12': ['I', 'i', 'Photo I', 'photo i'],
      },
      exercise_2_vocabulary: {
        '1': ['dictionary', 'Dictionary'],
        '2': ['remember', 'Remember', "can't remember", 'cant remember'],
        '3': ['course', 'Course'],
        '4': ['board', 'Board'],
        '5': ['library', 'Library'],
        '6': ['failed', 'Failed'],
        '7': ['exam', 'Exam'],
        '8': ['passed', 'Passed'],
      },
      exercise_4a_matching: {
        '1': ['E', 'e'],
        '2': ['D', 'd'],
        '3': ['B', 'b'],
        '4': ['C', 'c'],
        '5': ['A', 'a'],
      },
      exercise_4b_answers: {
        '1': [
          'she often talks to people from other countries',
          'she uses it for her work',
          'she talks to people from other countries',
          'Because she uses it for her work',
          'she talks to people from different countries',
        ],
        '2': [
          'there is an English exam',
          'she has an English exam',
          'there is an exam on Saturday',
          'she has an exam on Saturday',
          'there is an English exam on Saturday',
        ],
        '3': [
          'he is very good and knows about her exam',
          'he is very good',
          'the teacher is very good',
          'he knows about her exam',
          'the teacher is very good and knows about her exam',
        ],
      },
      exercise_5_grammar_box: {
        '1': ['do you study English', 'do you study English?'],
        '2': ["didn't you study English at school", "didn't you study English at school?", "did you study English at school", "did you study English at school?"],
        '3': ['do you study here', 'do you study here?'],
        '4': ['have you got four lessons this week', 'have you got four lessons this week?'],
      },
      exercise_7a_conversation: {
        '1': ['do you', 'Do you'],
        '2': ['Because', 'because'],
        '3': ['I', 'i'],
        '4': ['Where', 'where'],
        '5': ['Why', 'why'],
        '6': ["it's", "It's", 'it is', 'It is'],
        '7': ['Do', 'do'],
        '8': ['because', 'Because'],
        '9': ['Why', 'why'],
        '10': ['because', 'Because'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 9D: English in action & Check and reflect
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380904',
    title: '9D English in action',
    order: 36,
    content: `
      <div class="lesson-section">
        <h3>Useful Phrases: Making & Responding to Suggestions</h3>
        <p>Learn natural phrases to suggest activities, accept or decline proposals politely, and agree on weekend plans: <em>Let's do something!, Shall we go at 7.30?, That's a great idea!, Good idea., Sorry, I don't like it., Hmm. I went there last week., When shall we go?, Where shall we go?, What shall we watch?</em></p>
        <h3>Listening & Dialogue Ordering</h3>
        <p>Listen to conversations about cinema, restaurants, and watching TV (Audio 9.16), practice pronunciation (Audio 9.17), and reconstruct dialogue order (Audio 9.18).</p>
        <h3>Check and Reflect (Unit 9 Review)</h3>
        <p>Comprehensive review of Unit 9: prepositions of place, object pronouns, hobbies and verbs with <em>-ing</em>, study habits collocations, <em>why</em> &amp; <em>because</em> questions and answers, and confidence self-reflection (1–5).</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> make and respond to suggestions, make plans.<br/>
        <strong>Speaking:</strong> weekend planner role-play.<br/>
        <strong>Review:</strong> Unit 9 grammar, vocabulary, and pronunciation.</p>

        <h4>Useful Phrases: Making Suggestions & Plans</h4>
        <table class="theory-table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Key Phrases</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Making suggestions</strong></td>
              <td><em>Let's do something!</em><br/><em>Shall we go at 7.30?</em><br/><em>Let's watch a music programme.</em></td>
            </tr>
            <tr>
              <td><strong>Saying yes to suggestions</strong></td>
              <td><em>That's a great idea!</em><br/><em>Good idea.</em><br/><em>Great idea! What shall we play?</em></td>
            </tr>
            <tr>
              <td><strong>Saying no to suggestions</strong></td>
              <td><em>Sorry, I don't like it.</em><br/><em>Hmm. I went there last week.</em><br/><em>Hmm. I don't like reading.</em></td>
            </tr>
            <tr>
              <td><strong>Making plans</strong></td>
              <td><em>When shall we go?</em><br/><em>Where shall we go?</em><br/><em>What shall we watch? / What shall we do?</em><br/><em>Let's meet there at seven.</em></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    answerKey: {
      exercise_1b_conversations: {
        '1': ['C', 'c', 'Photo C', 'photo c'],
        '2': ['A', 'a', 'Photo A', 'photo a'],
        '3': ['B', 'b', 'Photo B', 'photo b'],
      },
      exercise_2a_alternatives: {
        '1': ['music', 'Music', 'music programme', 'music program'],
        '2': ['8.00', '8:00', '8', 'eight'],
        '3': ['Thai', 'thai', 'Thai restaurant', 'thai restaurant'],
      },
      exercise_2b_phrase_sources: {
        phrase_1: ['2'],
        phrase_2: ['2'],
        phrase_3: ['3'],
        phrase_4: ['1'],
        phrase_5: ['1'],
        phrase_6: ['3'],
        phrase_7: ['2'],
        phrase_8: ['3'],
        phrase_9: ['2'],
      },
      exercise_3a_order: {
        a: ['4'],
        b: ['10'],
        c: ['7'],
        d: ['3'],
        e: ['6'],
        f: ['9'],
        g: ['1'],
        h: ['8'],
        i: ['11'],
        j: ['2'],
        k: ['12'],
        l: ['5'],
      },
      check_ex1_prepositions: {
        '1': ['on', 'On'],
        '2': ['above', 'Above'],
        '3': ['behind', 'Behind'],
        '4': ['at', 'At'],
        '5': ['below', 'Below'],
        '6': ['in front of', 'In front of'],
        '7': ['next to', 'Next to'],
        '8': ['between', 'Between'],
        '9': ['in', 'In'],
      },
      check_ex2_pronouns: {
        '1': ['him', 'Him'],
        '2': ['her', 'Her'],
        '3': ['them', 'Them'],
        '4': ['me', 'Me'],
        '5': ['us', 'Us'],
        '6': ['it', 'It'],
      },
      check_ex3a_verbs: {
        '1': ['listen to', 'Listen to'],
        '2': ['read', 'Read'],
        '3': ['do', 'Do'],
        '4': ['watched', 'Watched'],
        '5': ['use', 'Use'],
        '6': ['play', 'Play'],
      },
      check_ex4_verb_forms: {
        '1': ['love reading', 'Love reading'],
        '2': ['hate doing', 'Hate doing'],
        '3_aux': ['do', 'Do'],
        '3_verb': ['enjoy watching', 'Enjoy watching'],
        '4': ['loves listening to', 'Loves listening to'],
        '5': ["doesn't enjoy working", "does not enjoy working", "doesnt enjoy working"],
        '6_aux': ['do', 'Do'],
        '6_verb': ['like listening to', 'Like listening to'],
        '7': ["don't like getting up", "do not like getting up", "dont like getting up"],
      },
      check_ex5_verbs_box: {
        '1': ['take', 'Take'],
        '2': ['pass', 'Pass'],
        '3': ['fail', 'Fail'],
        '4': ['do', 'Do'],
        '5': ['use', 'Use'],
        '6': ['go to', 'Go to'],
        '7': ['know', 'Know'],
        '8': ['wrote', 'Wrote'],
      },
      check_ex6a_questions: {
        '1': ['Why are you hungry?', 'Why are you hungry'],
        '2': ["Why don't you eat your salad?", "Why don't you eat your salad", "Why do not you eat your salad?"],
        '3': ["Why doesn't Leo know the answer?", "Why doesn't Leo know the answer", "Why does not Leo know the answer?"],
        '4': ["Why didn't you go to work last week?", "Why didn't you go to work last week", "Why did you not go to work last week?"],
        '5': ['Why was Sam late this morning?', 'Why was Sam late this morning'],
        '6': ['Why can Sara speak Portuguese?', 'Why can Sara speak Portuguese'],
        '7': ['Why have we got a new teacher?', 'Why have we got a new teacher'],
      },
      check_ex6b_matching: {
        '1': ['g', 'G'],
        '2': ['c', 'C'],
        '3': ['b', 'B'],
        '4': ['d', 'D'],
        '5': ['f', 'F'],
        '6': ['a', 'A'],
        '7': ['e', 'E'],
      },
    },
    unit,
  });
}
