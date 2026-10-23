import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit2(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
    await lessonRepository.save({
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
      unit,
    });

    await lessonRepository.save({
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
      unit,
    });

    await lessonRepository.save({
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
      unit,
    });

    await lessonRepository.save({
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
      unit,
    });


}
