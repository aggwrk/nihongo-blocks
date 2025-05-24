
export const expandedLessonData = {
  'particles-intro': {
    title: 'Introduction to Particles',
    description: 'Learn the basics of Japanese particles',
    steps: [
      {
        title: "What are particles?",
        explanation: "Particles are like little helpers that show the relationship between words in a sentence!",
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
        title: "The topic marker は (wa)",
        explanation: "は marks the topic of the sentence - what we're talking about.",
        example: {
          japanese: "日本は美しいです。",
          romaji: "Nihon wa utsukushii desu.",
          english: "Japan is beautiful.",
          blocks: [
            { text: "日本", romaji: "nihon", type: "subject", meaning: "Japan" },
            { text: "は", romaji: "wa", type: "particle", meaning: "topic marker" },
            { text: "美しい", romaji: "utsukushii", type: "adjective", meaning: "beautiful" },
            { text: "です", romaji: "desu", type: "verb", meaning: "to be (polite)" }
          ]
        },
        tip: "は is written with the hiragana for 'ha' but pronounced 'wa' when used as a particle!"
      }
    ]
  },
  'particles-ga-wo': {
    title: 'Subject and Object Particles',
    description: 'Master が (ga) and を (wo) particles',
    steps: [
      {
        title: "The subject marker が (ga)",
        explanation: "が marks the subject - who or what is doing the action.",
        example: {
          japanese: "犬が走っています。",
          romaji: "Inu ga hashitte imasu.",
          english: "The dog is running.",
          blocks: [
            { text: "犬", romaji: "inu", type: "subject", meaning: "dog" },
            { text: "が", romaji: "ga", type: "particle", meaning: "subject marker" },
            { text: "走って", romaji: "hashitte", type: "verb", meaning: "running" },
            { text: "います", romaji: "imasu", type: "verb", meaning: "continuous form" }
          ]
        },
        tip: "が highlights the subject and often answers 'who' or 'what' questions!"
      },
      {
        title: "The object marker を (wo)",
        explanation: "を marks the direct object - what the action is being done to.",
        example: {
          japanese: "りんごを食べます。",
          romaji: "Ringo wo tabemasu.",
          english: "I eat an apple.",
          blocks: [
            { text: "りんご", romaji: "ringo", type: "object", meaning: "apple" },
            { text: "を", romaji: "wo", type: "particle", meaning: "object marker" },
            { text: "食べます", romaji: "tabemasu", type: "verb", meaning: "to eat (polite)" }
          ]
        },
        tip: "を is written with the hiragana for 'wo' but pronounced 'o' in modern Japanese!"
      }
    ]
  },
  'location-particles': {
    title: 'Location and Direction Particles',
    description: 'Learn に (ni), で (de), and へ (e) for locations',
    steps: [
      {
        title: "The location particle で (de)",
        explanation: "で marks where an action takes place.",
        example: {
          japanese: "学校で勉強します。",
          romaji: "Gakkou de benkyou shimasu.",
          english: "I study at school.",
          blocks: [
            { text: "学校", romaji: "gakkou", type: "object", meaning: "school" },
            { text: "で", romaji: "de", type: "particle", meaning: "location of action" },
            { text: "勉強", romaji: "benkyou", type: "object", meaning: "study" },
            { text: "します", romaji: "shimasu", type: "verb", meaning: "to do (polite)" }
          ]
        },
        tip: "で is used for the location where an action happens!"
      },
      {
        title: "The destination particle に (ni)",
        explanation: "に marks the destination or target of movement.",
        example: {
          japanese: "東京に行きます。",
          romaji: "Toukyou ni ikimasu.",
          english: "I go to Tokyo.",
          blocks: [
            { text: "東京", romaji: "toukyou", type: "object", meaning: "Tokyo" },
            { text: "に", romaji: "ni", type: "particle", meaning: "destination" },
            { text: "行きます", romaji: "ikimasu", type: "verb", meaning: "to go (polite)" }
          ]
        },
        tip: "に shows the destination or specific time!"
      }
    ]
  }
};
