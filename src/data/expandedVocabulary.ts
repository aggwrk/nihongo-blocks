
export const vocabularyByLevel = {
  1: [
    {
      japanese: '私',
      hiragana: 'わたし',
      romaji: 'watashi',
      english: 'I, me',
      type: 'noun' as const,
      example: {
        japanese: '私は学生です。',
        romaji: 'Watashi wa gakusei desu.',
        english: 'I am a student.'
      }
    },
    {
      japanese: 'あなた',
      hiragana: 'あなた',
      romaji: 'anata',
      english: 'you',
      type: 'noun' as const,
      example: {
        japanese: 'あなたは先生ですか。',
        romaji: 'Anata wa sensei desu ka.',
        english: 'Are you a teacher?'
      }
    },
    {
      japanese: '学生',
      hiragana: 'がくせい',
      romaji: 'gakusei',
      english: 'student',
      type: 'noun' as const,
      example: {
        japanese: '田中さんは学生です。',
        romaji: 'Tanaka-san wa gakusei desu.',
        english: 'Tanaka-san is a student.'
      }
    },
    {
      japanese: '先生',
      hiragana: 'せんせい',
      romaji: 'sensei',
      english: 'teacher',
      type: 'noun' as const,
      example: {
        japanese: '山田先生は優しいです。',
        romaji: 'Yamada sensei wa yasashii desu.',
        english: 'Teacher Yamada is kind.'
      }
    }
  ],
  2: [
    {
      japanese: '食べる',
      hiragana: 'たべる',
      romaji: 'taberu',
      english: 'to eat',
      type: 'verb' as const,
      example: {
        japanese: 'りんごを食べます。',
        romaji: 'Ringo wo tabemasu.',
        english: 'I eat an apple.'
      }
    },
    {
      japanese: '飲む',
      hiragana: 'のむ',
      romaji: 'nomu',
      english: 'to drink',
      type: 'verb' as const,
      example: {
        japanese: '水を飲みます。',
        romaji: 'Mizu wo nomimasu.',
        english: 'I drink water.'
      }
    },
    {
      japanese: '行く',
      hiragana: 'いく',
      romaji: 'iku',
      english: 'to go',
      type: 'verb' as const,
      example: {
        japanese: '学校に行きます。',
        romaji: 'Gakkou ni ikimasu.',
        english: 'I go to school.'
      }
    },
    {
      japanese: '来る',
      hiragana: 'くる',
      romaji: 'kuru',
      english: 'to come',
      type: 'verb' as const,
      example: {
        japanese: '友達が来ます。',
        romaji: 'Tomodachi ga kimasu.',
        english: 'My friend comes.'
      }
    }
  ],
  3: [
    {
      japanese: '大きい',
      hiragana: 'おおきい',
      romaji: 'ookii',
      english: 'big, large',
      type: 'adjective' as const,
      example: {
        japanese: 'この家は大きいです。',
        romaji: 'Kono ie wa ookii desu.',
        english: 'This house is big.'
      }
    },
    {
      japanese: '小さい',
      hiragana: 'ちいさい',
      romaji: 'chiisai',
      english: 'small',
      type: 'adjective' as const,
      example: {
        japanese: '猫は小さいです。',
        romaji: 'Neko wa chiisai desu.',
        english: 'The cat is small.'
      }
    },
    {
      japanese: '新しい',
      hiragana: 'あたらしい',
      romaji: 'atarashii',
      english: 'new',
      type: 'adjective' as const,
      example: {
        japanese: '新しい車を買いました。',
        romaji: 'Atarashii kuruma wo kaimashita.',
        english: 'I bought a new car.'
      }
    },
    {
      japanese: '古い',
      hiragana: 'ふるい',
      romaji: 'furui',
      english: 'old',
      type: 'adjective' as const,
      example: {
        japanese: '古い本があります。',
        romaji: 'Furui hon ga arimasu.',
        english: 'There is an old book.'
      }
    }
  ]
};
