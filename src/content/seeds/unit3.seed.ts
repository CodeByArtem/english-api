import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';

export async function seedUnit3(
  unit: Unit,
  lessonRepository: Repository<Lesson>,
): Promise<void> {
    await lessonRepository.save({
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
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
      title: '3B Is there wifi?',
      order: 10,
      content: `
        <div class="lesson-section">
          <h3>Page 24: Vocabulary & Listening — Rooms and things in a home</h3>
          <p>Learn rooms and facilities: living room, kitchen, bedroom, bathroom, beds, lift, oven, shower, toilet, TV, wifi.</p>
          <p>Listening 3.5: Listen to people asking about three holiday flats in Brighton.</p>
          <h3>Page 25: Grammar & Speaking — there is / there are</h3>
          <p>Grammar focus on <em>Is there a...?</em>, <em>Are there any...?</em>, <em>How many... are there?</em> with short answers.</p>
          <p>Speaking: Asking questions about flats, holiday homes, and comparing facilities.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goals:</strong> describe a flat • ask about things in a flat • compare holiday flats.<br/>
          <strong>Grammar:</strong> there is / there are (questions and short answers).<br/>
          <strong>Vocabulary:</strong> rooms and things in a home (living room, kitchen, bedroom, bathroom, shower, lift, oven, toilet, TV, wifi).</p>
          <h4>Questions with Is there / Are there / How many</h4>
          <ul>
            <li><strong>Singular:</strong> <em>Is there a shower?</em> → <em>Yes, there is. / No, there isn't.</em></li>
            <li><strong>Plural:</strong> <em>Are there any shops?</em> → <em>Yes, there are. / No, there aren't.</em></li>
            <li><strong>Number:</strong> <em>How many bedrooms are there?</em> → <em>There are two bedrooms. / There is one bedroom.</em></li>
          </ul>
        </div>
      `,
      answerKey: {
        exercise_2a_matching: {
          A: ['living room'],
          B: ['kitchen'],
          C: ['bedroom'],
          D: ['bathroom'],
          E: ['toilet'],
          F: ['shower'],
          G: ['beds', 'bed'],
          H: ['oven'],
          I: ['lift'],
          J: ['TV', 'tv', 'television'],
          K: ['wifi', 'wi-fi'],
        },
        exercise_5a_flat: {
          answer: ['Flat 3', 'flat 3', '3'],
        },
        exercise_5b_ticks: {
          '1': ['true'],
          '2': ['true'],
          '3': ['true'],
          '4': ['true'],
          '5': ['true'],
          '6': ['true'],
          '8': ['true'],
        },
        exercise_5c_articles: {
          '1': ['a'],
          '2': ['a'],
          '3': ['a'],
          '4': ['an'],
        },
        exercise_6_grammar: {
          '1': ['Is', 'is'],
          '2': ['Are', 'are'],
          '3': ['is'],
          '4': ["isn't", 'is not', 'isnt'],
          '5': ["aren't", 'are not', 'arent'],
          '6': ['are'],
          '7': ['is'],
          '8': ['are'],
        },
        exercise_7a_intonation: {
          '1': ['up', '↑'],
          '2': ['down', '↓'],
          '3': ['up', '↑'],
          '4': ['down', '↓'],
          '5': ['down', '↓'],
          '6': ['down', '↓'],
        },
        exercise_8_conversation: {
          '1': ['are there', 'Are there'],
          '2': ['There are', 'there are'],
          '3': ['Is there', 'is there'],
          '4': ['there is'],
          '5': ['Is there', 'is there'],
          '6': ['there is'],
          '7': ['Are there', 'are there'],
          '8': ["there aren't", 'there are not'],
          '9': ['There is', 'there is'],
          '10': ['Is there', 'is there'],
          '11': ["there isn't", 'there is not'],
        },
        exercise_9a_word_order: {
          '1': ['Where is your house or flat?', 'Where is your flat or house?'],
          '2': ['How many rooms are there?'],
          '3': ['Is there a shower?'],
          '4': ['How many TVs are there?'],
          '5': ['Is there wifi?', 'Is there wi-fi?'],
        },
      },
      media_links: [
        '/audio/3.4.mp3',
        '/audio/3.5.mp3',
        '/audio/3.6.mp3',
        '/audio/3.7.mp3',
        '/audio/3.8.mp3',
        '/audio/3.9.mp3',
      ],
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
      title: "3C It's expensive!",
      order: 11,
      content: `
        <div class="lesson-section">
          <h3>Page 26: Vocabulary &amp; Reading — Describing places</h3>
          <p>Learn adjectives for describing places: busy, quiet, big, small, old, new, cheap, expensive, good, bad.</p>
          <p>Reading: Welcome to North Norfolk! Read about West Runton, Sheringham, and Cromer.</p>
          <h3>Page 27: Grammar &amp; Speaking — Position of adjectives</h3>
          <p>Grammar focus on position of adjectives (be + adjective vs. adjective + noun).</p>
          <p>Speaking: Describing towns, cities, shops, restaurants and places you know.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> describe a town or a city.<br/>
          <strong>Grammar:</strong> position of adjectives.<br/>
          <strong>Vocabulary:</strong> describing places (busy, quiet, big, small, old, new, cheap, expensive, good, bad).</p>
          <h4>Position of Adjectives</h4>
          <ul>
            <li><strong>be + adjective:</strong> <em>It's big.</em> / <em>This town is busy.</em> / <em>It isn't expensive.</em></li>
            <li><strong>adjective + noun:</strong> <em>This is a quiet town.</em> / <em>There's an old cinema.</em> / <em>There are cheap shops.</em></li>
          </ul>
          <p><strong>Note:</strong> Adjectives go before nouns and do not have plural forms (<em>cheap shops</em>, not <em>cheaps shops</em>).</p>
        </div>
      `,
      answerKey: {
        exercise_3_opposites: {
          '1': ['bad'],
          '2': ['big', 'large'],
          '3': ['old'],
          '4': ['expensive'],
          '5': ['quiet'],
        },
        exercise_5_places_matching: {
          A: ['1', 'West Runton'],
          B: ['3', 'Cromer'],
          C: ['2', 'Sheringham'],
        },
        exercise_6_true_false: {
          '1': ['F', 'false'],
          '2': ['F', 'false'],
          '3': ['T', 'true'],
          '4': ['T', 'true'],
          '5': ['F', 'false'],
          '6': ['T', 'true'],
        },
        exercise_9_word_order: {
          '1': ['This restaurant is expensive.'],
          '2': ['There is a small park.'],
          '3': ['These hotels are not cheap.', "These hotels aren't cheap."],
          '4': ['This is a busy station.'],
          '5': ['It is not a big supermarket.', "It isn't a big supermarket."],
          '6': ['Is this a new bank?'],
          '7': ['Is there a big station in your town?'],
          '8': ['Are there any good restaurants in your town?'],
        },
      },
      media_links: ['/audio/3.12.mp3', '/audio/3.13.mp3'],
      unit,
    });

    await lessonRepository.save({
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
      title: '3D English in action',
      order: 12,
      content: `
        <div class="lesson-section">
          <h3>Page 28: English in action — Asking for and giving directions</h3>
          <p>Learn how to ask for and give directions in a town: turn left, turn right, go straight on, go past, next to.</p>
          <p>Listening 3.14 &amp; 3.16: Follow routes on the town map and complete directions conversations.</p>
          <h3>Page 29: Check &amp; reflect — Unit 3 Review</h3>
          <p>Review places in town, there is / there are, adjectives, and self-assessment for Unit 3.</p>
        </div>
      `,
      theory: `
        <div class="theory-section">
          <p><strong>Goal:</strong> ask for and give directions.<br/>
          <strong>Useful phrases:</strong><br/>
          <em>Excuse me. Where's the..., please?</em><br/>
          <em>Is there a... near here?</em><br/>
          <em>Go straight on. / Go down Station Road.</em><br/>
          <em>Turn left / Turn right.</em><br/>
          <em>Go past the hotel. / It's next to the bank.</em><br/>
          <em>It's on the right / on the left.</em></p>
        </div>
      `,
      answerKey: {
        exercise_2a_questions: {
          '1': ['at the train station', 'train station', 'the train station', 'station', 'at the station'],
          '2': [
            'at the restaurant',
            'at the Polish restaurant',
            'the restaurant',
            'the Polish restaurant',
            'Polish restaurant',
            'restaurant',
            'on Main Street',
            'Main Street',
          ],
        },
        exercise_2b_order: {
          A: ['4', '1', 'go straight on'],
          B: ['3', '5', 'turn left'],
          C: ['2', '3', 'turn right'],
          D: ['5', '2', 'go past the hotel'],
          E: ['6', 'the restaurant is next to a bank'],
          F: ['1', '4', 'go down Station Road'],
        },
        exercise_3_phrases_order: {
          '1': ['3', 'Is there a supermarket near here?'],
          '2': ['4', "Yes, there's one on Station Road."],
          '3': ['1'],
          '4': ['2', "It's on Park Street."],
          '5': ['9', 'Go past the bank.'],
          '6': ['6', 'Go straight on.'],
          '7': ['5', 'Go down Main Street.'],
          '8': ['7', 'Turn left at the bookshop.'],
          '9': ['8', 'Turn right after the big house.'],
          '10': ['10', "It's next to a restaurant."],
          '11': ['11', "It's on the right."],
          '12': ['12', 'The supermarket is on the right.'],
        },
        exercise_4a_conversations: {
          '1': [
            'Is there a supermarket near here?',
            'is there a supermarket near here?',
            'Is there a supermarket near here',
            'Where is the supermarket?',
            "Where's the supermarket?",
          ],
          '2': [
            'Go straight on',
            'go straight on',
            'Go down Station Road',
            'go down Station Road',
          ],
          '3': [
            "Where's the cinema, please?",
            "where's the cinema, please?",
            "Where is the cinema, please?",
            "Where's the cinema?",
            'Where is the cinema?',
            'Is there a cinema near here?',
          ],
          '4': [
            'turn left into Park Street',
            'Turn left into Park Street',
            'turn left',
            'Turn left',
          ],
          '5': [
            'turn left at the bookshop',
            'Turn left at the bookshop',
            'turn left into Market Street',
            'turn left into Bank Road',
            'turn left',
            'Turn left',
          ],
        },
        review_1a_places: {
          '1': ['train station'],
          '2': ['cinema'],
          '3': ['café', 'cafe'],
          '4': ['supermarket'],
          '5': ['park'],
          '6': ['hotel'],
          '7': ['house'],
          '8': ['flat'],
          '9': ['bank'],
          '10': ['restaurant'],
          '11': ['market'],
          '12': ['bookshop'],
        },
        review_2_is_are: {
          '2': ['is', "'s"],
          '3': ["isn't", 'is not', 'isnt'],
          '4': ['are', "'re"],
          '5': ["aren't", 'are not', 'arent'],
          '6': ['are', "'re"],
          '7': ['are', "'re"],
          '8': ["isn't", 'is not', 'isnt'],
        },
        review_3_corrections: {
          '1': [
            'There are no dogs in the park today.',
            'There are no dogs in the park today',
            "There aren't any dogs in the park today.",
            "There aren't any dogs in the park today",
          ],
          '2': [
            'There are three keys in the kitchen.',
            'There are three keys in the kitchen',
          ],
          '3': [
            "There's a box in the living room.",
            "There's a box in the living room",
            'There is a box in the living room.',
            'There is a box in the living room',
          ],
          '4': [
            "There isn't a teacher in our class today!",
            "There isn't a teacher in our class today",
            'There is not a teacher in our class today!',
            'There is not a teacher in our class today',
          ],
        },
        review_4_alternatives: {
          '1': ['kitchen'],
          '2': ['living room'],
          '3': ['bathrooms'],
          '4': ['beds'],
          '5': ['shower'],
          '6': ['TV', 'tv'],
        },
        review_5a_classroom: {
          '2': ['Are there any', 'are there any'],
          '3a': ['How many', 'how many'],
          '3b': ['are there'],
          '4': ['Is there', 'is there'],
          '5': ['Are there any', 'are there any'],
          '6a': ['How many', 'how many'],
          '6b': ['are there'],
        },
        review_6_adjectives: {
          '2': ['old'],
          '3': ['big', 'large'],
          '4': ['quiet'],
          '5': ['expensive'],
          '6': ['busy'],
          '7': ['cheap'],
        },
        review_7_rewrite: {
          '3': ['shop is cheap'],
          '4': ['are new houses', 'are new'],
          '5': ['street is quiet'],
          '6': ['is a busy station', 'is busy'],
          '7': ['computers are new'],
          '8': ['is an old man', 'is old'],
        },
        review_8a_order: {
          '2': ['Is your town busy?', 'Is your town busy'],
          '3': ['Is there a quiet park near your house?', 'Is there a quiet park near your house'],
          '4': [
            'Is your house big or small?',
            'Is your house small or big?',
            'Is your house big or small',
            'Is your house small or big',
          ],
          '5': [
            'Are hotels in your town expensive or cheap?',
            'Are hotels in your town cheap or expensive?',
            'Are hotels in your town expensive or cheap',
            'Are hotels in your town cheap or expensive',
          ],
        },
      },
      media_links: ['/audio/3.14.mp3', '/audio/3.15.mp3', '/audio/3.16.mp3'],
      unit,
    });


}
