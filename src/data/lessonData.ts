
export const lessonData = {
  'particles-basics': {
    title: "Particle Basics",
    steps: [
      {
        title: "What are particles?",
        explanation: "Particles are like road signs that show relationships between words in Japanese sentences!",
        example: {
          japanese: "私は学生です。",
          romaji: "Watashi wa gakusei desu.",
          english: "I am a student.",
          blocks: [
            { text: "私", romaji: "watashi", type: "subject", meaning: "I" },
            { text: "は", romaji: "wa", type: "particle", meaning: "topic marker" },
            { text: "学生", romaji: "gakusei", type: "object", meaning: "student" },
            { text: "です", romaji: "desu", type: "verb", meaning: "to be (polite)" }
          ]
        },
        tip: "The particle 'は' (wa) marks what the sentence is about - the topic!"
      },
      {
        title: "Object Particle を (wo)",
        explanation: "を marks the direct object - what receives the action of the verb!",
        example: {
          japanese: "りんごを食べます。",
          romaji: "Ringo wo tabemasu.",
          english: "I eat an apple.",
          blocks: [
            { text: "りんご", romaji: "ringo", type: "object", meaning: "apple" },
            { text: "を", romaji: "wo", type: "particle", meaning: "object marker" },
            { text: "食べます", romaji: "tabemasu", type: "verb", meaning: "eat (polite)" }
          ]
        },
        tip: "を always comes after the thing being acted upon!"
      },
      {
        title: "Location Particle で (de)",
        explanation: "で shows where an action takes place!",
        example: {
          japanese: "学校で勉強します。",
          romaji: "Gakkou de benkyou shimasu.",
          english: "I study at school.",
          blocks: [
            { text: "学校", romaji: "gakkou", type: "object", meaning: "school" },
            { text: "で", romaji: "de", type: "particle", meaning: "at/in (location)" },
            { text: "勉強します", romaji: "benkyou shimasu", type: "verb", meaning: "study" }
          ]
        },
        tip: "で is used for the location where activities happen!"
      }
    ]
  },
  'adjectives-intro': {
    title: "Japanese Adjectives",
    steps: [
      {
        title: "い-Adjectives",
        explanation: "い-adjectives end in い and can directly modify nouns!",
        example: {
          japanese: "大きい犬です。",
          romaji: "Ookii inu desu.",
          english: "It's a big dog.",
          blocks: [
            { text: "大きい", romaji: "ookii", type: "adjective", meaning: "big" },
            { text: "犬", romaji: "inu", type: "subject", meaning: "dog" },
            { text: "です", romaji: "desu", type: "verb", meaning: "to be" }
          ]
        },
        tip: "い-adjectives can go directly before nouns without any particles!"
      },
      {
        title: "な-Adjectives",
        explanation: "な-adjectives need な when they come before nouns!",
        example: {
          japanese: "静かな公園です。",
          romaji: "Shizuka na kouen desu.",
          english: "It's a quiet park.",
          blocks: [
            { text: "静か", romaji: "shizuka", type: "adjective", meaning: "quiet" },
            { text: "な", romaji: "na", type: "particle", meaning: "adjective connector" },
            { text: "公園", romaji: "kouen", type: "subject", meaning: "park" },
            { text: "です", romaji: "desu", type: "verb", meaning: "to be" }
          ]
        },
        tip: "Remember: な-adjectives need な before nouns, but not when they're at the end!"
      }
    ]
  },
  'verb-forms': {
    title: "Basic Verb Forms",
    steps: [
      {
        title: "Present Tense (Polite)",
        explanation: "Most verbs end in ます in polite present tense!",
        example: {
          japanese: "毎日走ります。",
          romaji: "Mainichi hashirimasu.",
          english: "I run every day.",
          blocks: [
            { text: "毎日", romaji: "mainichi", type: "object", meaning: "every day" },
            { text: "走ります", romaji: "hashirimasu", type: "verb", meaning: "run" }
          ]
        },
        tip: "ます form is the polite way to end sentences!"
      },
      {
        title: "Past Tense (Polite)",
        explanation: "Past tense uses ました instead of ます!",
        example: {
          japanese: "昨日映画を見ました。",
          romaji: "Kinou eiga wo mimashita.",
          english: "I watched a movie yesterday.",
          blocks: [
            { text: "昨日", romaji: "kinou", type: "object", meaning: "yesterday" },
            { text: "映画", romaji: "eiga", type: "object", meaning: "movie" },
            { text: "を", romaji: "wo", type: "particle", meaning: "object marker" },
            { text: "見ました", romaji: "mimashita", type: "verb", meaning: "watched" }
          ]
        },
        tip: "Just change ます to ました for past tense!"
      }
    ]
  }
};

export const quizData = [
  {
    id: 'particles-basic',
    prompt: "Arrange: 'I eat sushi'",
    correctOrder: ["私", "は", "寿司", "を", "食べます"],
    blocks: [
      { text: "食べます", romaji: "tabemasu", type: "verb" as const, meaning: "eat" },
      { text: "私", romaji: "watashi", type: "subject" as const, meaning: "I" },
      { text: "寿司", romaji: "sushi", type: "object" as const, meaning: "sushi" },
      { text: "は", romaji: "wa", type: "particle" as const, meaning: "topic marker" },
      { text: "を", romaji: "wo", type: "particle" as const, meaning: "object marker" }
    ],
    translation: "Watashi wa sushi wo tabemasu."
  },
  {
    id: 'adjectives-i',
    prompt: "Build: 'The book is interesting'",
    correctOrder: ["本", "は", "面白い", "です"],
    blocks: [
      { text: "面白い", romaji: "omoshiroi", type: "adjective" as const, meaning: "interesting" },
      { text: "です", romaji: "desu", type: "verb" as const, meaning: "to be" },
      { text: "本", romaji: "hon", type: "subject" as const, meaning: "book" },
      { text: "は", romaji: "wa", type: "particle" as const, meaning: "topic marker" }
    ],
    translation: "Hon wa omoshiroi desu."
  },
  {
    id: 'location-particle',
    prompt: "Create: 'I study at the library'",
    correctOrder: ["私", "は", "図書館", "で", "勉強します"],
    blocks: [
      { text: "勉強します", romaji: "benkyou shimasu", type: "verb" as const, meaning: "study" },
      { text: "私", romaji: "watashi", type: "subject" as const, meaning: "I" },
      { text: "図書館", romaji: "toshokan", type: "object" as const, meaning: "library" },
      { text: "は", romaji: "wa", type: "particle" as const, meaning: "topic marker" },
      { text: "で", romaji: "de", type: "particle" as const, meaning: "at/in" }
    ],
    translation: "Watashi wa toshokan de benkyou shimasu."
  },
  {
    id: 'past-tense',
    prompt: "Form: 'I went to school yesterday'",
    correctOrder: ["私", "は", "昨日", "学校", "に", "行きました"],
    blocks: [
      { text: "行きました", romaji: "ikimashita", type: "verb" as const, meaning: "went" },
      { text: "私", romaji: "watashi", type: "subject" as const, meaning: "I" },
      { text: "学校", romaji: "gakkou", type: "object" as const, meaning: "school" },
      { text: "昨日", romaji: "kinou", type: "object" as const, meaning: "yesterday" },
      { text: "は", romaji: "wa", type: "particle" as const, meaning: "topic marker" },
      { text: "に", romaji: "ni", type: "particle" as const, meaning: "to/towards" }
    ],
    translation: "Watashi wa kinou gakkou ni ikimashita."
  },
  {
    id: 'na-adjective',
    prompt: "Build: 'It's a quiet room'",
    correctOrder: ["静か", "な", "部屋", "です"],
    blocks: [
      { text: "静か", romaji: "shizuka", type: "adjective" as const, meaning: "quiet" },
      { text: "です", romaji: "desu", type: "verb" as const, meaning: "to be" },
      { text: "部屋", romaji: "heya", type: "subject" as const, meaning: "room" },
      { text: "な", romaji: "na", type: "particle" as const, meaning: "adjective connector" }
    ],
    translation: "Shizuka na heya desu."
  }
];
