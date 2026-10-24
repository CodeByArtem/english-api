import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit5(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e01',
    title: '5A My week',
    order: 17,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Everyday Activities & Days of the Week</h3>
        <p>Learn daily routine verbs (get up, have breakfast, go to work, work, have lunch, go home, have dinner, watch TV, study, go to bed) and days of the week.</p>
        <h3>Reading: Mari's Week</h3>
        <p>Read about nurse Mari's routine from Monday to Friday and how she spends her weekends.</p>
        <h3>Grammar: Present Simple (I / you / we / they) & Time Prepositions</h3>
        <p>Study affirmative and negative statements in Present Simple, as well as time expressions with <em>at</em> (times), <em>on</em> (days), and <em>from... to...</em>.</p>
        <h3>Speaking & Interaction: True/False sentences & Weekend Routines</h3>
        <p>Write true and false sentences about your week (Ex 9), prepare notes on Friday, Saturday, and Sunday routines (Ex 10), interview a partner (Ex 11a), and report similarities and differences to the class (Ex 11b).</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> describe part of your week.<br/>
        <strong>Grammar:</strong> present simple: <em>I / you / we / they</em>.<br/>
        <strong>Vocabulary:</strong> days of the week, everyday activities.</p>
        <h4>Present Simple: I / you / we / they</h4>
        <ul>
          <li><strong>+ Affirmative:</strong> I / You / We / They <em>go</em> to work. / I <em>get up</em> at 7 o'clock.</li>
          <li><strong>- Negative:</strong> I / You / We / They <em>don't work</em> at the weekend.</li>
        </ul>
        <h4>Prepositions of Time</h4>
        <ul>
          <li>Use <strong>at</strong> + times: <em>at 8 o'clock, at half past five, at seven thirty</em></li>
          <li>Use <strong>on</strong> + days: <em>on Mondays, on Saturdays, on weekdays</em></li>
          <li>Use <strong>from... to...</strong> for periods: <em>from Monday to Friday, from nine to five</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1_matching: {
        '1': ['E', 'e', 'Picture E', 'Photo E'],
        '2': ['H', 'h', 'Picture H', 'Photo H'],
        '3': ['F', 'f', 'Picture F', 'Photo F'],
        '4': ['A', 'a', 'Picture A', 'Photo A'],
        '5': ['C', 'c', 'Picture C', 'Photo C'],
        '6': ['G', 'g', 'Picture G', 'Photo G'],
        '7': ['B', 'b', 'Picture B', 'Photo B'],
        '8': ['J', 'j', 'Picture J', 'Photo J'],
        '9': ['I', 'i', 'Picture I', 'Photo I'],
        '10': ['D', 'd', 'Picture D', 'Photo D'],
      },
      exercise_3b_sentences: {
        '1': ['work'],
        '2': ['go to', 'go to the'],
        '3': ['have'],
        '4': ['have'],
        '5': ['study'],
        '6': ['get up'],
        '7': ['watch'],
      },
      exercise_5a_reading: {
        '1': ['nurse', 'a nurse', "She's a nurse", 'She is a nurse', "She's a nurse.", 'She is a nurse.'],
        '2': ['yes', 'Yes', 'Yes, they are', 'Yes, they are.', 'yes, they are'],
      },
      exercise_6_grammar: {
        '1': ['at'],
        '2': ['at'],
        '3': ['on'],
        '4': ['On', 'on'],
      },
      exercise_8_sentences: {
        '1': ['I get up at six on Mondays.', 'On Mondays, I get up at six.', 'I get up at six on Mondays', 'On Mondays I get up at six'],
        '2': ['I have breakfast at seven thirty.', 'At seven thirty, I have breakfast.', 'I have breakfast at seven thirty', 'At seven thirty I have breakfast'],
        '3': ['I go to work at half past eight.', 'At half past eight, I go to work.', 'I go to work at half past eight', 'At half past eight I go to work'],
        '4': ['I work from nine to five.', 'From nine to five, I work.', 'I work from nine to five', 'From nine to five I work'],
        '5': ['I have dinner with my family at seven.', 'At seven, I have dinner with my family.', 'I have dinner with my family at seven', 'At seven I have dinner with my family', 'I have dinner at seven with my family.', 'I have dinner at seven with my family'],
        '6': ["I don't go to bed late.", "I don't go to bed late", 'I do not go to bed late.', 'I do not go to bed late'],
        '7': ["I don't work on Saturdays and Sundays.", "On Saturdays and Sundays, I don't work.", "I don't work on Sundays and Saturdays.", "On Sundays and Saturdays, I don't work.", "I don't work on Saturdays and Sundays", "On Saturdays and Sundays I don't work"],
        '8': ['I watch TV and read books on Saturdays.', 'On Saturdays, I watch TV and read books.', 'I read books and watch TV on Saturdays.', 'On Saturdays, I read books and watch TV.', 'I watch TV and read books on Saturdays', 'On Saturdays I watch TV and read books'],
      },
    },
    media_links: ['/audio/5.1.mp3', '/audio/5.2.mp3', '/audio/5.3.mp3'],
    unit,
  });

  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e02',
    title: '5B A long journey',
    order: 18,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary & Listening: Travel and Transport</h3>
        <p>Match transport photos (Ex 1a), listen and repeat sentences with Audio 5.4 (Ex 1b), discuss personal commute routines (Ex 1c), and learn transport collocations (Ex 2a-c).</p>
        <h3>Listening: Tim & Donna</h3>
        <p>Listen to Tim and Donna describing how they travel to work and their commute times.</p>
        <h3>Grammar: Present Simple Questions (I / you / we / they)</h3>
        <p>Master question formation with <em>Do you...?</em>, short answers (<em>Yes, I do / No, I don't</em>), and question words (<em>How, What time</em>).</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> talk about how you travel to work/university.<br/>
        <strong>Grammar:</strong> present simple questions: <em>I / you / we / they</em>.<br/>
        <strong>Vocabulary:</strong> travel and transport.</p>
        <h4>Present Simple Questions</h4>
        <ul>
          <li><strong>Yes/No Questions:</strong> <em>Do</em> I / you / we / they drive to work?</li>
          <li><strong>Short Answers:</strong> Yes, I do. / No, I don't.</li>
          <li><strong>With Question Words:</strong> <em>How</em> do you travel? / <em>What time</em> do you leave home? / <em>What time</em> do you arrive at work?</li>
        </ul>
        <h4>Transport Collocations</h4>
        <ul>
          <li><strong>go / travel + by:</strong> by bus, by train, by car, by bike, by boat, by taxi</li>
          <li><strong>take + a:</strong> take a boat, take a train, take a taxi, take a bus</li>
          <li><strong>verbs of movement:</strong> walk to work, cycle to work, drive to work</li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['A', 'a', 'Photo A', 'photo a'],
        '2': ['F', 'f', 'Photo F', 'photo f'],
        '3': ['D', 'd', 'Photo D', 'photo d'],
        '4': ['B', 'b', 'Photo B', 'photo b'],
        '5': ['C', 'c', 'Photo C', 'photo c'],
        '6': ['E', 'e', 'Photo E', 'photo e'],
        '7': ['G', 'g', 'Photo G', 'photo g'],
      },
      exercise_2a_phrases: {
        '1': ['b', 'go/travel', 'travel/go', 'go', 'travel'],
        '2': ['c', 'take'],
        '3': ['a', 'cycle/drive/walk', 'cycle', 'drive', 'walk'],
      },
      exercise_2b_sentences: {
        '1': ['to'],
        '2': ['by'],
        '3': ['take'],
        '4': ['go', 'travel'],
        '5': ['to'],
      },
      exercise_2c_opposite: {
        '1': ['arrive', 'arrive at', 'Arrive', 'to arrive'],
      },
      exercise_3a_table: {
        'tim_transport': ['train', 'by train', 'the train'],
        'tim_leaves': ['6.45', '6:45', 'six forty-five', 'quarter to seven', 'at 6.45', 'at 6:45'],
        'tim_arrives': ['8.00', '8:00', "8 o'clock", "eight o'clock", '8', 'eight', 'at 8.00', 'at 8:00'],
        'donna_transport': ['car', 'by car'],
        'donna_leaves': ['7.30', '7:30', 'seven thirty', 'half past seven', 'at 7.30', 'at 7:30'],
      },
      exercise_3b_questions: {
        '1': ['true', 'checked', 'yes'],
        '3': ['true', 'checked', 'yes'],
        '4': ['true', 'checked', 'yes'],
        '5': ['true', 'checked', 'yes'],
      },
      exercise_4_grammar: {
        '1': ['Do', 'do'],
        '2': ['do'],
        '3': ["don't", 'do not'],
        '4': ['do'],
        '5': ['do'],
        '6': ['do'],
      },
      exercise_5_pronunciation: {
        '1': ['different', 'Different'],
      },
      exercise_6_alternatives: {
        '1': ['do you travel'],
        '2': ['cycle'],
        '3': ['Do you go'],
        '4': ["we don't"],
        '5': ['do you leave'],
        '6': ['I walk'],
        '7': ['I take'],
        '8': ['do you arrive'],
        '9': ['do your children travel'],
        '10': ['They go'],
        '11': ['leave'],
        '12': ['do they arrive'],
      },
      exercise_7a_order: {
        '1': ['What time do you leave home?', 'What time do you leave home'],
        '2': ['Do you travel to work by bus?', 'Do you travel to work by bus'],
        '3': ['What time do you have lunch in your office?', 'What time do you have lunch in your office'],
        '4': ['How do you travel home?', 'How do you travel home'],
        '5': ['Do people at your office drive to work?', 'Do people at your office drive to work'],
        '6': [
          'Do you cycle on Saturdays and Sundays?',
          'Do you cycle on Saturdays and Sundays',
          'Do you cycle on Sundays and Saturdays?',
          'Do you cycle on Sundays and Saturdays',
        ],
      },
      exercise_8b_questions: {
        '2': ["Do you leave home at 8 o'clock?", "Do you leave home at 8 o'clock", "Do you leave home at 8:00?", "Do you leave home at 8:00"],
        '3': [
          'Have you got a long journey to work/university?',
          'Have you got a long journey to work/university',
          'Do you have a long journey to work/university?',
          'Do you have a long journey to work/university',
          'Have you got a long journey to work?',
          'Do you have a long journey to work?',
        ],
        '4': [
          'Do you take two different forms of transport?',
          'Do you take two different forms of transport',
        ],
        '5': [
          'Have you got a short journey to work/university?',
          'Have you got a short journey to work/university',
          'Do you have a short journey to work/university?',
          'Do you have a short journey to work/university',
          'Have you got a short journey to work?',
          'Do you have a short journey to work?',
        ],
      },
    },
    media_links: ['/audio/5.4.mp3', '/audio/5.5.mp3', '/audio/5.6.mp3'],
    unit,
  });

  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e03',
    title: '5C Food and drink',
    order: 19,
    content: `
      <div class="lesson-section">
        <h3>Vocabulary: Food and Drink</h3>
        <p>Learn 14 essential food and drink items (tea, milk, cakes, sugar, sandwiches, salad, fish, bread, eggs, cheese, meat, chicken, chocolate, coffee) and practise their pronunciation.</p>
        <h3>Listening: Radio Programme on Healthy Eating</h3>
        <p>Listen to Tom and Basil discussing their eating habits and frequency adverbs.</p>
        <h3>Grammar: Present Simple with Frequency Adverbs</h3>
        <p>Learn to express frequency with <em>always, usually, often, sometimes, never</em>, position them in sentences, and ask questions with <em>How often...?</em>.</p>
        <h3>Speaking: Healthy Habits Survey</h3>
        <p>Ask and answer questions about eating habits, compare routines with a partner, and report back.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> take part in a survey about being healthy.<br/>
        <strong>Grammar:</strong> present simple with frequency adverbs.<br/>
        <strong>Vocabulary:</strong> food and drink.</p>
        <h4>Frequency Adverbs Scale</h4>
        <ul>
          <li><strong>100%</strong>: always (<em>I always drink tea in the morning.</em>)</li>
          <li><strong>~80%</strong>: usually (<em>I usually eat chocolate at work.</em>)</li>
          <li><strong>~60%</strong>: often (<em>I often eat cakes.</em>)</li>
          <li><strong>~30%</strong>: sometimes (<em>I sometimes eat fish or salad.</em>)</li>
          <li><strong>0%</strong>: never (<em>I never drink coffee.</em>)</li>
        </ul>
        <h4>Word Order with Frequency Adverbs</h4>
        <ul>
          <li>Frequency adverbs go <strong>before</strong> most verbs: <em>I <strong>often</strong> eat meat.</em> / <em>She <strong>never</strong> drinks coffee.</em></li>
          <li>Frequency adverbs go <strong>after</strong> the verb <em>to be</em>: <em>I am <strong>never</strong> hungry in the morning.</em> / <em>They are <strong>sometimes</strong> late.</em></li>
          <li>Ask questions about frequency with: <em><strong>How often</strong> do you eat sweet food?</em> / <em><strong>How often</strong> are you late for work?</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_1a_matching: {
        '1': ['tea', 'Tea', 'cup of tea', 'a cup of tea'],
        '2': ['milk', 'Milk', 'bottle of milk', 'a bottle of milk'],
        '3': ['cakes', 'Cakes', 'cake', 'cupcakes'],
        '4': ['sugar', 'Sugar'],
        '5': ['sandwiches', 'Sandwiches', 'sandwich'],
        '6': ['salad', 'Salad'],
        '7': ['fish', 'Fish', 'salmon'],
        '8': ['bread', 'Bread'],
        '9': ['eggs', 'Eggs', 'egg'],
        '10': ['cheese', 'Cheese'],
        '11': ['meat', 'Meat', 'steaks', 'steak'],
        '12': ['chicken', 'Chicken'],
        '13': ['chocolate', 'Chocolate'],
        '14': ['coffee', 'Coffee', 'cup of coffee'],
      },
      exercise_2_sounds: {
        '1': ['different', 'Different'],
        '2': ['same', 'Same'],
        '3': ['same', 'Same'],
        '4': ['different', 'Different'],
        '5': ['same', 'Same'],
        '6': ['different', 'Different'],
        '7': ['same', 'Same'],
      },
      exercise_4a_tick: {
        'tea': ['true', 'checked', 'yes'],
        'coffee': ['true', 'checked', 'yes'],
        'cakes': ['true', 'checked', 'yes'],
        'chocolate': ['true', 'checked', 'yes'],
        'fish': ['true', 'checked', 'yes'],
        'salad': ['true', 'checked', 'yes'],
        'meat': ['true', 'checked', 'yes'],
      },
      exercise_5_diagram: {
        '1': ['never', 'Never'],
        '2': ['sometimes', 'Sometimes'],
        '3': ['always', 'Always'],
      },
      exercise_6_grammar: {
        '1': ['before', 'Before'],
        '2': ['How often', 'how often', 'How often / How many'],
      },
      exercise_7a_stress: {
        '1': ['ne', 'never', 'ne-ver'],
        '2': ['some', 'sometimes', 'some-times'],
        '3': ['of', 'often', 'of-ten'],
        '4': ['u', 'usually', 'u-sually'],
        '5': ['al', 'always', 'al-ways'],
      },
      exercise_8a_adverbs: {
        '1': ['always', 'usually', 'often', 'sometimes', 'never'],
        '2': ['always', 'usually', 'often', 'sometimes', 'never'],
        '3': ['always', 'usually', 'often', 'sometimes', 'never'],
        '4': ['always', 'usually', 'often', 'sometimes', 'never'],
        '5': ['always', 'usually', 'often', 'sometimes', 'never'],
        '6': ['always', 'usually', 'often', 'sometimes', 'never'],
        '7': ['always', 'usually', 'often', 'sometimes', 'never'],
        '8': ['always', 'usually', 'often', 'sometimes', 'never'],
      },
      exercise_9a_questions: {
        '1': ['How often do you have breakfast at work?', 'How often do you have breakfast at work'],
        '2': ['How often do you have eggs for breakfast?', 'How often do you have eggs for breakfast'],
        '3': ['How often do you buy sandwiches for lunch?', 'How often do you buy sandwiches for lunch'],
        '4': [
          'How often do you drink coffee or tea?',
          'How often do you drink coffee or tea',
          'How often do you drink tea or coffee?',
          'How often do you drink tea or coffee',
        ],
        '5': ['How often do you have dinner at home?', 'How often do you have dinner at home'],
        '6': ['How often do you eat sweet food?', 'How often do you eat sweet food'],
      },
    },
    media_links: ['/audio/5.10.mp3', '/audio/5.11.mp3', '/audio/5.12.mp3', '/audio/5.13.mp3'],
    unit,
  });

  await lessonRepository.save({
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e04',
    title: '5D English in action & Check and reflect',
    order: 20,
    content: `
      <div class="lesson-section">
        <h3>English in Action: In a Café</h3>
        <p>Learn phrases for ordering food and drinks in a café, understanding menu options, and paying for an order.</p>
        <h3>Review: Check & Reflect</h3>
        <p>Review days of the week, daily routine collocations, present simple word order, negatives, transport crossword, error correction, food anagrams, and frequency adverbs.</p>
      </div>
    `,
    theory: `
      <div class="theory-section">
        <p><strong>Goal:</strong> order food and a drink in a café.<br/>
        <strong>Key Phrases:</strong></p>
        <h4>Café Worker</h4>
        <ul>
          <li><em>What would you like?</em></li>
          <li><em>Would you like white bread or brown bread?</em></li>
          <li><em>Would you like a drink?</em></li>
          <li><em>Would you like sugar?</em></li>
          <li><em>That's £4.00, please.</em></li>
        </ul>
        <h4>Customer</h4>
        <ul>
          <li><em>I'd like a chicken sandwich, please.</em></li>
          <li><em>White bread, please.</em></li>
          <li><em>Yes, please. I'd like a cup of black coffee.</em></li>
          <li><em>No, thank you. How much is that?</em></li>
          <li><em>Here you are. / Thank you.</em></li>
        </ul>
      </div>
    `,
    answerKey: {
      exercise_2_menu_tick: {
        'chicken_sandwich': ['true', 'checked', 'yes'],
        'coffee': ['true', 'checked', 'yes'],
        'chocolate_cupcake': ['true', 'checked', 'yes'],
      },
      exercise_3_conversation: {
        '1': ['chicken', 'a chicken', 'Chicken'],
        '2': ['bread', 'Bread'],
        '3': ['White', 'white'],
        '4': ['black coffee', 'coffee', 'Black coffee'],
        '5': ['sugar', 'Sugar'],
        '6': ['£6.45', '6.45', '£4.00', '4.00', '£7.45', '7.45'],
      },
      exercise_4a_phrases: {
        '1': ['a', 'A'],
        '2': ['d', 'D'],
        '3': ['c', 'C'],
        '4': ['b', 'B'],
        '5': ['e', 'E'],
      },
      exercise_5a_order: {
        '1': ['g', 'G'],
        '2': ['c', 'C'],
        '3': ['e', 'E'],
        '4': ['f', 'F'],
        '5': ['i', 'I'],
        '6': ['b', 'B'],
        '7': ['d', 'D'],
        '8': ['h', 'H'],
        '9': ['a', 'A'],
      },
      exercise_1_reflect_days: {
        '1': ['Monday', 'monday', 'onday'],
        '2': ['Tuesday', 'tuesday', 'uesday'],
        '3': ['Wednesday', 'wednesday', 'ednesday'],
        '4': ['Thursday', 'thursday', 'ursday'],
        '5': ['Friday', 'friday', 'riday'],
        '6': ['Saturday', 'saturday', 'aturday'],
        '7': ['Sunday', 'sunday', 'unday'],
      },
      exercise_2_reflect_match: {
        '1': ['f', 'F'],
        '2': ['c', 'C'],
        '3': ['d', 'D'],
        '4': ['b', 'B'],
        '5': ['e', 'E'],
        '6': ['a', 'A'],
      },
      exercise_3_reflect_order: {
        '1': ['I get up late on Sundays.', 'I get up late on Sundays'],
        '2': ['We have breakfast at 7 o\'clock.', 'We have breakfast at 7 o\'clock', 'We have breakfast at 7:00.'],
        '3': ['They don\'t work every day.', 'They don\'t work every day', 'They do not work every day.'],
        '4': ['You don\'t study on Saturdays.', 'You don\'t study on Saturdays', 'You do not study on Saturdays.'],
        '5': [
          'We watch TV on Saturdays and Sundays.',
          'We watch TV on Saturdays and Sundays',
          'We watch TV on Sundays and Saturdays.',
          'We watch TV on Sundays and Saturdays',
        ],
        '6': ['They go home at 5 o\'clock.', 'They go home at 5 o\'clock', 'They go home at 5:00.'],
      },
      exercise_4_reflect_negative: {
        '1': ['They don\'t play football on Sundays.', 'They don\'t play football on Sundays', 'They do not play football on Sundays.'],
        '2': ['We don\'t have lunch at one thirty.', 'We don\'t have lunch at one thirty', 'We do not have lunch at one thirty.'],
        '3': ['They don\'t go to bed at 10 o\'clock.', 'They don\'t go to bed at 10 o\'clock', 'They do not go to bed at 10 o\'clock.'],
        '4': ['I don\'t work from Monday to Friday.', 'I don\'t work from Monday to Friday', 'I do not work from Monday to Friday.'],
        '5': ['They don\'t study at home on Wednesdays.', 'They don\'t study at home on Wednesdays', 'They do not study at home on Wednesdays.'],
        '6': ['I don\'t get up late on Mondays.', 'I don\'t get up late on Mondays', 'I do not get up late on Mondays.'],
      },
      exercise_5_reflect_crossword: {
        '1': ['take', 'Take'],
        '2': ['drive', 'Drive'],
        '3': ['arrive', 'Arrive'],
        '4': ['leave', 'Leave'],
        '5': ['cycle', 'Cycle'],
        '6': ['walk', 'Walk'],
        secret: ['travel', 'Travel'],
        // Backward compatibility
        '1_down': ['take', 'Take', 'drive', 'Drive'],
        '2_down': ['drive', 'Drive', 'cycle', 'Cycle'],
        '3_across': ['arrive', 'Arrive', 'train', 'Train'],
        '4_down': ['leave', 'Leave', 'bike', 'Bike'],
        '5_down': ['cycle', 'Cycle', 'taxi', 'Taxi'],
        '6_across': ['walk', 'Walk', 'take', 'Take'],
      },
      exercise_6_reflect_verbs: {
        '1': ['cycle'],
        '2': ['drive'],
        '3': ['take'],
        '4_leave': ['leave'],
        '4_arrive': ['arrive'],
        '5': ['walk'],
        '6': ['travel'],
      },
      exercise_7a_reflect_mistakes: {
        '2': [
          'What time do you arrive at your office?',
          'What time do you arrive at your office',
        ],
        '3': [
          'Do you have a big breakfast every day?',
          'Do you have a big breakfast every day',
        ],
        '5': [
          'Do Simon and Lucy get up early?',
          'Do Simon and Lucy get up early',
        ],
        '6': [
          'What time do you leave the house in the morning?',
          'What time do you leave the house in the morning',
        ],
        '8': [
          'How do your friends travel to university?',
          'How do your friends travel to university',
        ],
      },
      exercise_8a_reflect_anagrams: {
        '1': ['fish', 'Fish'],
        '2': ['cheese', 'Cheese'],
        '3': ['sugar', 'Sugar'],
        '4': ['chocolate', 'Chocolate'],
        '5': ['sandwiches', 'Sandwiches'],
        '6': ['salad', 'Salad'],
        '7': ['chicken', 'Chicken'],
      },
      exercise_8b_reflect_cross: {
        '1': ['sugar cake', 'Sugar cake'],
        '2': ['a cup of meat', 'cup of meat'],
        '3': ['a milk sandwich', 'milk sandwich'],
        '4': ['bread salad', 'Bread salad'],
      },
      exercise_9a_reflect_order: {
        '1': [
          'We usually have dinner at 8.30 in the evening.',
          'We usually have dinner at 8.30 in the evening',
          'We usually have dinner at 8:30 in the evening.',
          'We usually have dinner at 8:30 in the evening',
        ],
        '2': ['I am never hungry in the morning.', 'I am never hungry in the morning', 'I\'m never hungry in the morning.', 'I\'m never hungry in the morning'],
        '3': [
          'I always have meat or fish for lunch.',
          'I always have meat or fish for lunch',
          'I always have fish or meat for lunch.',
          'I always have fish or meat for lunch',
        ],
        '4': ['Do you often eat chicken?', 'Do you often eat chicken'],
        '5': ['How often do you buy coffee in a coffee shop?', 'How often do you buy coffee in a coffee shop'],
        '6': ['Are your friends sometimes late for class?', 'Are your friends sometimes late for class'],
        '7': ['Do your parents always work on Mondays?', 'Do your parents always work on Mondays'],
      },
    },
    media_links: ['/audio/5.14.mp3', '/audio/5.15.mp3', '/audio/5.16.mp3'],
    unit,
  });
}
