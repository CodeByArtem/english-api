import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit10(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  // ----------------------------------------------------
  // Lesson 10A: Goals
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd381001',
    title: '10A Goals',
    order: 37,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Goal Collocations</h3>
        <p>Learn common verb-noun collocations to talk about future goals, wishes, and plans: <em>start a business, join a book club, make friends, change jobs, spend time with family, try a new sport, have a baby, sell some things, build a house, move to a city</em>.</p>
        <h3>Listening: What are your goals?</h3>
        <p>Listen to ten people discussing their life goals, aspirations, and career or lifestyle dreams.</p>
        <h3>Grammar: would like / would love to</h3>
        <p>Learn how to use <em>would like to + infinitive</em> and <em>would love to + infinitive</em> to talk about wishes, hopes, and future ambitions in positive, negative, and question forms.</p>
        <h3>Pronunciation: like vs 'd like</h3>
        <p>Recognize the crucial difference between <em>like</em> (talking about current general preferences) and <em>'d like</em> (talking about future desires or specific wishes).</p>
        <h3>Speaking: Dreams & Ambitions Survey</h3>
        <p>Prepare questions about dreams and life goals, interview classmates, and record a spoken summary for the teacher using AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> ask and answer about dreams and wishes.<br/>
        <strong>Grammar:</strong> <em>would like / love to</em>.<br/>
        <strong>Vocabulary:</strong> goal collocations.</p>
        
        <h4>Goal Collocations</h4>
        <ul>
          <li><strong>start</strong> a business / a company / a new project</li>
          <li><strong>join</strong> a book club / a sports team / a gym</li>
          <li><strong>make</strong> friends with someone at work / friends in a new city</li>
          <li><strong>change</strong> jobs / my car</li>
          <li><strong>spend</strong> more time with family / time with my parents</li>
          <li><strong>try</strong> a new sport / something different</li>
          <li><strong>have</strong> a baby / a son or a daughter</li>
          <li><strong>sell</strong> some things / old books online</li>
          <li><strong>build</strong> a house / a desk for my bedroom</li>
          <li><strong>move</strong> to a city / to a small village / to another country</li>
        </ul>

        <h4>Grammar: would like to / would love to</h4>
        <p>We use <strong>would like to</strong> or <strong>would love to</strong> + infinitive to talk about future wishes and ambitions. <em>Would love to</em> is stronger than <em>would like to</em>.</p>
        
        <table class="theory-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Structure</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Positive (+)</strong></td>
              <td>I/You/He/She/We/They + <strong>'d like / would love to</strong> + verb</td>
              <td><em>I'd like to start a business.<br/>She'd love to live by the sea.</em></td>
            </tr>
            <tr>
              <td><strong>Negative (-)</strong></td>
              <td>I/You/He/She/We/They + <strong>wouldn't like to</strong> + verb</td>
              <td><em>I wouldn't like to work in an office.<br/>We wouldn't like to go to a cold place.</em></td>
            </tr>
            <tr>
              <td><strong>Yes/No questions</strong></td>
              <td><strong>Would</strong> + subject + <strong>like to</strong> + verb?</td>
              <td><em>Would you like to have more money?<br/>Yes, I would. / No, I wouldn't.</em></td>
            </tr>
            <tr>
              <td><strong>Wh- questions</strong></td>
              <td><strong>Question word</strong> + would + subject + <strong>like to</strong> + verb?</td>
              <td><em>What would you like to do in the future?<br/>When would you like to start?</em></td>
            </tr>
          </tbody>
        </table>

        <h4>Important Contrast: like vs would like</h4>
        <ul>
          <li><strong>like / love + -ing:</strong> general preferences (things you enjoy now):<br/>
          <em>I like making clothes. (It is my hobby now.)</em></li>
          <li><strong>would like / love to + infinitive:</strong> wishes and ambitions (things you want in the future):<br/>
          <em>I'd like to open a shop. (I want to do this in the future.)</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_2a_speakers: {
        Natalie: ['E', 'e', 'Photo E', 'photo e'],
        Andy: ['D', 'd', 'Photo D', 'photo d'],
        Lars: ['A', 'a', 'Photo A', 'photo a'],
        Maria: ['B', 'b', 'Photo B', 'photo b'],
        Stella: ['C', 'c', 'Photo C', 'photo c'],
      },
      exercise_2b_phrases: {
        '1': ['a business', 'business'],
        '2': ['a book club', 'book club'],
        '3': ['friends', 'some friends'],
        '4': ['jobs', 'job'],
        '5': ['my family', 'family'],
        '6': ['sport', 'a sport', 'new sport'],
        '7': ['a baby', 'baby', 'children'],
        '8': ['some things', 'things', 'our old books', 'old books'],
        '9': ['a house', 'house'],
        '10': ['a city', 'city', 'a big city', 'big city'],
      },
      exercise_3a_verbs: {
        '1': ['change', 'Change'],
        '2': ['try', 'Try'],
        '3': ['make', 'Make'],
        '4': ['sell', 'Sell'],
        '5': ['join', 'Join'],
        '6': ['spend', 'Spend'],
        '7': ['have', 'Have'],
        '8': ['start', 'Start'],
        '9': ['move', 'Move'],
        '10': ['build', 'Build'],
      },
      exercise_5_grammar: {
        '1': ["'d", 'would', "'d like"],
        '2': ['to'],
        '3': ["'d", 'would', "'d love"],
        '4': ['to'],
        '5': ["wouldn't", 'would not'],
        '6': ['to'],
        '7': ['Would', 'would'],
        '8': ['to'],
        '9': ['would'],
        '10': ['to'],
        '11': ['would'],
        '12': ['to'],
      },
      exercise_6a_pronunciation: {
        '1': ['b', 'B'],
        '2': ['a', 'A'],
        '3': ['b', 'B'],
        '4': ['a', 'A'],
      },
      exercise_7_dialogue: {
        '1': ['would you like', 'would you like to'],
        '2': ["I'd like", "I would like"],
        '3': ['love'],
        '4': ['to have'],
        '5': ['would you like', 'would'],
        '6': ['make'],
        '7': ['I love'],
        '8': ['to do'],
        '9': ['I love'],
        '10': ["I'd like", "I would like"],
        '11': ['would you like'],
        '12': ['to go'],
        '13': ['I love'],
        '14': ['to go'],
      },
    },
    unit,
  });

  // ----------------------------------------------------
  // Lesson 10B: Party time
  // ----------------------------------------------------
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd381002',
    title: '10B Party time',
    order: 38,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Party</h3>
        <p>Learn key vocabulary for party activities and food & drinks: <em>talk to friends, play games, listen to music, dance, sing songs, snacks, drinks, a dessert, sandwiches, salad, fruit</em>.</p>
        <h3>Listening: Planning a Class Party</h3>
        <p>Listen to Charlie and Leo discussing preparations and ideas for an end-of-term class party.</p>
        <h3>Grammar: be going to for Future Plans</h3>
        <p>Learn how to use <em>be going to + infinitive</em> in affirmative and negative sentences to talk about intentions and future plans.</p>
        <h3>Pronunciation: Weak form of to</h3>
        <p>Practice pronouncing <em>going to</em> with a natural weak form of <em>to</em> (/tə/).</p>
        <h3>Speaking & Recording: Plan Your Party</h3>
        <p>Work on a group party planner (when, where, food, drinks, music, games) and record your spoken presentation for the teacher using AudioAnswerRecorder.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about future plans.<br/>
        <strong>Grammar:</strong> <em>be going to</em> (positive and negative).<br/>
        <strong>Vocabulary:</strong> party activities, food and drink.</p>

        <h4>Party Vocabulary</h4>
        <div class="vocab-grid">
          <div>
            <h5>Activities</h5>
            <ul>
              <li><strong>talk to friends:</strong> have fun conversations with classmates and friends.</li>
              <li><strong>play games:</strong> play board games, card games, or party games.</li>
              <li><strong>listen to music:</strong> put on songs or dance music.</li>
              <li><strong>dance:</strong> move to music on the dance floor.</li>
              <li><strong>sing songs:</strong> sing together or karaoke.</li>
            </ul>
          </div>
          <div>
            <h5>Food & Drink</h5>
            <ul>
              <li><strong>snacks:</strong> light bites like crisps, nuts, and pretzels.</li>
              <li><strong>drinks:</strong> juice, soda, water, tea, or coffee.</li>
              <li><strong>a dessert:</strong> sweet food at the end of a meal, like cake or fruit tart.</li>
              <li><strong>sandwiches:</strong> bread with cheese, meat, or vegetables.</li>
              <li><strong>salad:</strong> fresh vegetables mixed together in a bowl.</li>
              <li><strong>fruit:</strong> apples, bananas, berries, grapes, and oranges.</li>
            </ul>
          </div>
        </div>

        <h4>Grammar: be going to + infinitive</h4>
        <p>We use <strong>be going to + infinitive</strong> to talk about <strong>future plans and intentions</strong> that we decided before speaking.</p>

        <table class="theory-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Subject</th>
              <th>be</th>
              <th>going to + verb</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3"><strong>Positive (+)</strong></td>
              <td>I</td>
              <td><strong>am / 'm</strong></td>
              <td>going to + verb</td>
              <td><em>I'm going to have a party.</em></td>
            </tr>
            <tr>
              <td>He / She / It</td>
              <td><strong>is / 's</strong></td>
              <td>going to + verb</td>
              <td><em>Leo's going to make sandwiches.</em></td>
            </tr>
            <tr>
              <td>You / We / They</td>
              <td><strong>are / 're</strong></td>
              <td>going to + verb</td>
              <td><em>We're going to sing songs.</em></td>
            </tr>
            <tr>
              <td rowspan="3"><strong>Negative (-)</strong></td>
              <td>I</td>
              <td><strong>am not / 'm not</strong></td>
              <td>going to + verb</td>
              <td><em>I'm not going to dance.</em></td>
            </tr>
            <tr>
              <td>He / She / It</td>
              <td><strong>is not / isn't</strong></td>
              <td>going to + verb</td>
              <td><em>Jack isn't going to come.</em></td>
            </tr>
            <tr>
              <td>You / We / They</td>
              <td><strong>are not / aren't</strong></td>
              <td>going to + verb</td>
              <td><em>We aren't going to play games.</em></td>
            </tr>
          </tbody>
        </table>

        <h4>Pronunciation Note: Weak 'to'</h4>
        <p>In spoken English, <em>to</em> in <em>going to</em> is pronounced weakly as <strong>/tə/</strong>: <em>/gəʊɪŋ tə/</em>.</p>
      </div>
    `,
    answerKey: {
      exercise_3_items: {
        snacks: ['true', 'snacks'],
        drinks: ['true', 'drinks'],
        sandwiches: ['true', 'sandwiches'],
        sing_songs: ['true', 'sing songs', 'singing songs'],
        play_games: ['true', 'play games', 'playing games'],
        listen_to_music: ['true', 'listen to music', 'music'],
      },
      exercise_4a_plan: ['1', 'future plan', 'to talk about a future plan', 'a future plan'],
      exercise_4b_verbs: {
        '1': ['have', 'Have'],
        '2': ['make', 'Make'],
        '3': ['sing', 'Sing'],
        '4': ['play', 'Play'],
      },
      exercise_5_grammar: {
        '1': ["'m not", 'am not', 'm not'],
        '2': ['are', "'re", 're'],
        '3': ["aren't", 'are not', 'arent'],
        '4': ['is', "'s", 's'],
        '5': ["isn't", 'is not', 'isnt'],
      },
      exercise_7_sentences: {
        '1': ['is going to eat', "'s going to eat", 'is gonna eat'],
        '2': ['are going to buy', "'re going to buy"],
        '3': ['is going to sing', "'s going to sing"],
        '4': ['am going to cycle', "'m going to cycle"],
        '5': ['are going to arrive', "'re going to arrive"],
        '6': ['am going to make', "'m going to make"],
        '7': ['is not going to come', "isn't going to come", "'s not going to come"],
        '8': ['is not going to play', "isn't going to play", "'s not going to play"],
      },
    },
    unit,
  });
}
