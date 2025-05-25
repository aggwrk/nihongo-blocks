
export const advancedLessons = [
  {
    id: 'keigo-intro',
    title: 'Introduction to Keigo (Polite Language)',
    description: 'Master the fundamentals of Japanese honorific language',
    level_required: 5,
    jlpt_level: 'N4',
    category: 'keigo',
    xp_reward: 150,
    order_index: 10,
    content: {
      steps: [
        {
          title: 'What is Keigo?',
          explanation: 'Keigo (敬語) is the honorific language system used to show respect in Japanese. It has three main types: Sonkeigo (respectful), Kenjougo (humble), and Teineigo (polite).',
          example: {
            japanese: 'いらっしゃいませ',
            romaji: 'irasshaimase',
            english: 'Welcome (respectful greeting)',
            blocks: [
              { text: 'いらっしゃいませ', romaji: 'irasshaimase', type: 'expression', meaning: 'respectful welcome' }
            ]
          },
          tip: 'Keigo is essential for business and formal situations in Japan.'
        },
        {
          title: 'Sonkeigo - Respectful Language',
          explanation: 'Used when talking about others\' actions to show respect.',
          example: {
            japanese: '田中さんがいらっしゃいました',
            romaji: 'Tanaka-san ga irasshaimashita',
            english: 'Mr. Tanaka came (respectful)',
            blocks: [
              { text: '田中さん', romaji: 'Tanaka-san', type: 'noun', meaning: 'Mr. Tanaka' },
              { text: 'が', romaji: 'ga', type: 'particle', meaning: 'subject marker' },
              { text: 'いらっしゃいました', romaji: 'irasshaimashita', type: 'verb', meaning: 'came (respectful)' }
            ]
          },
          tip: 'いらっしゃる is the respectful form of いる/来る.'
        }
      ]
    }
  },
  {
    id: 'business-japanese-greetings',
    title: 'Business Japanese: Greetings and Introductions',
    description: 'Essential phrases for professional environments',
    level_required: 4,
    jlpt_level: 'N4',
    category: 'business',
    xp_reward: 125,
    order_index: 11,
    content: {
      steps: [
        {
          title: 'Business Card Exchange',
          explanation: 'Meishi koukan (名刺交換) is a crucial business ritual in Japan.',
          example: {
            japanese: 'こちら私の名刺です',
            romaji: 'kochira watashi no meishi desu',
            english: 'This is my business card',
            blocks: [
              { text: 'こちら', romaji: 'kochira', type: 'pronoun', meaning: 'this (polite)' },
              { text: '私の', romaji: 'watashi no', type: 'pronoun', meaning: 'my' },
              { text: '名刺', romaji: 'meishi', type: 'noun', meaning: 'business card' },
              { text: 'です', romaji: 'desu', type: 'verb', meaning: 'is (polite)' }
            ]
          },
          tip: 'Always present business cards with both hands and receive them respectfully.'
        },
        {
          title: 'Company Introductions',
          explanation: 'How to introduce your company professionally.',
          example: {
            japanese: '私は田中商事の営業部の田中と申します',
            romaji: 'watashi wa Tanaka Shouji no eigyoubu no Tanaka to moushimasu',
            english: 'I am Tanaka from the sales department of Tanaka Trading',
            blocks: [
              { text: '私は', romaji: 'watashi wa', type: 'pronoun', meaning: 'I (topic)' },
              { text: '田中商事の', romaji: 'Tanaka Shouji no', type: 'noun', meaning: 'Tanaka Trading\'s' },
              { text: '営業部の', romaji: 'eigyoubu no', type: 'noun', meaning: 'sales department\'s' },
              { text: '田中と申します', romaji: 'Tanaka to moushimasu', type: 'expression', meaning: 'called Tanaka (humble)' }
            ]
          },
          tip: '申します is the humble form of 言います.'
        }
      ]
    }
  },
  {
    id: 'cultural-lesson-bowing',
    title: 'Cultural Lesson: The Art of Bowing (Ojigi)',
    description: 'Understanding Japanese bowing culture and etiquette',
    level_required: 3,
    jlpt_level: 'N5',
    category: 'culture',
    xp_reward: 100,
    order_index: 12,
    content: {
      steps: [
        {
          title: 'Types of Bows',
          explanation: 'There are three main types of bows in Japan: Eshaku (15°), Keirei (30°), and Saikeirei (45°).',
          example: {
            japanese: 'よろしくお願いします',
            romaji: 'yoroshiku onegaishimasu',
            english: 'Please treat me favorably',
            blocks: [
              { text: 'よろしく', romaji: 'yoroshiku', type: 'adverb', meaning: 'favorably' },
              { text: 'お願いします', romaji: 'onegaishimasu', type: 'expression', meaning: 'please (polite request)' }
            ]
          },
          tip: 'The deeper the bow, the more respect or apology you are expressing.'
        },
        {
          title: 'When to Bow',
          explanation: 'Bowing situations include greetings, thanking, apologizing, and asking for favors.',
          example: {
            japanese: 'すみませんでした',
            romaji: 'sumimasen deshita',
            english: 'I am sorry (formal apology)',
            blocks: [
              { text: 'すみません', romaji: 'sumimasen', type: 'expression', meaning: 'excuse me/sorry' },
              { text: 'でした', romaji: 'deshita', type: 'verb', meaning: 'was (polite past)' }
            ]
          },
          tip: 'Even during phone calls, many Japanese people bow unconsciously.'
        }
      ]
    }
  },
  {
    id: 'advanced-grammar-conditionals',
    title: 'Advanced Grammar: Conditional Forms',
    description: 'Master complex conditional expressions in Japanese',
    level_required: 6,
    jlpt_level: 'N3',
    category: 'grammar',
    xp_reward: 175,
    order_index: 13,
    content: {
      steps: [
        {
          title: 'たら Form - Conditional',
          explanation: 'The たら form expresses "if/when" conditions.',
          example: {
            japanese: '雨が降ったら、家にいます',
            romaji: 'ame ga futtara, ie ni imasu',
            english: 'If it rains, I will stay home',
            blocks: [
              { text: '雨が', romaji: 'ame ga', type: 'noun', meaning: 'rain (subject)' },
              { text: '降ったら', romaji: 'futtara', type: 'verb', meaning: 'if it falls/rains' },
              { text: '家に', romaji: 'ie ni', type: 'noun', meaning: 'at home' },
              { text: 'います', romaji: 'imasu', type: 'verb', meaning: 'will be/stay' }
            ]
          },
          tip: 'たら is formed by adding ら to the past tense form.'
        },
        {
          title: 'ば Form - Conditional',
          explanation: 'The ば form expresses general conditions or hypothetical situations.',
          example: {
            japanese: '時間があれば、映画を見ます',
            romaji: 'jikan ga areba, eiga wo mimasu',
            english: 'If I have time, I will watch a movie',
            blocks: [
              { text: '時間が', romaji: 'jikan ga', type: 'noun', meaning: 'time (subject)' },
              { text: 'あれば', romaji: 'areba', type: 'verb', meaning: 'if there is' },
              { text: '映画を', romaji: 'eiga wo', type: 'noun', meaning: 'movie (object)' },
              { text: '見ます', romaji: 'mimasu', type: 'verb', meaning: 'will watch' }
            ]
          },
          tip: 'ば form is more literary and formal than たら.'
        }
      ]
    }
  },
  {
    id: 'conversation-patterns-shopping',
    title: 'Conversation Patterns: Shopping',
    description: 'Essential phrases for shopping situations',
    level_required: 3,
    jlpt_level: 'N4',
    category: 'conversation',
    xp_reward: 100,
    order_index: 14,
    content: {
      steps: [
        {
          title: 'Asking for Items',
          explanation: 'How to ask for specific items in a store.',
          example: {
            japanese: 'これはいくらですか',
            romaji: 'kore wa ikura desu ka',
            english: 'How much is this?',
            blocks: [
              { text: 'これは', romaji: 'kore wa', type: 'pronoun', meaning: 'this (topic)' },
              { text: 'いくら', romaji: 'ikura', type: 'pronoun', meaning: 'how much' },
              { text: 'ですか', romaji: 'desu ka', type: 'verb', meaning: 'is? (polite question)' }
            ]
          },
          tip: 'いくら is used specifically for asking about prices.'
        },
        {
          title: 'Making Purchases',
          explanation: 'Completing a purchase transaction.',
          example: {
            japanese: 'これをください',
            romaji: 'kore wo kudasai',
            english: 'Please give me this',
            blocks: [
              { text: 'これを', romaji: 'kore wo', type: 'pronoun', meaning: 'this (object)' },
              { text: 'ください', romaji: 'kudasai', type: 'expression', meaning: 'please give' }
            ]
          },
          tip: 'ください is the polite imperative form for requests.'
        }
      ]
    }
  }
];
