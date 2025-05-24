
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen } from 'lucide-react';
import VocabularyCard from './VocabularyCard';

interface VocabularyModeProps {
  onComplete: () => void;
}

const VocabularyMode = ({ onComplete }: VocabularyModeProps) => {
  const [currentWord, setCurrentWord] = useState(0);

  const vocabularyWords = [
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
    },
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
      japanese: '可愛い',
      hiragana: 'かわいい',
      romaji: 'kawaii',
      english: 'cute',
      type: 'adjective' as const,
      example: {
        japanese: '猫が可愛いです。',
        romaji: 'Neko ga kawaii desu.',
        english: 'The cat is cute.'
      }
    },
    {
      japanese: 'は',
      hiragana: 'は',
      romaji: 'wa',
      english: 'topic marker',
      type: 'particle' as const,
      example: {
        japanese: '私は日本人です。',
        romaji: 'Watashi wa nihonjin desu.',
        english: 'I am Japanese.'
      }
    },
    {
      japanese: 'が',
      hiragana: 'が',
      romaji: 'ga',
      english: 'subject marker',
      type: 'particle' as const,
      example: {
        japanese: '犬が走っています。',
        romaji: 'Inu ga hashitte imasu.',
        english: 'The dog is running.'
      }
    }
  ];

  const progress = ((currentWord + 1) / vocabularyWords.length) * 100;

  const handleNext = () => {
    if (currentWord < vocabularyWords.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onComplete}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Vocabulary
          </h2>
          <p className="text-sm text-gray-600">Word {currentWord + 1} of {vocabularyWords.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Vocabulary Card */}
      <VocabularyCard
        word={vocabularyWords[currentWord]}
        onNext={handleNext}
      />

      {/* Navigation Hint */}
      <Card className="glass-card p-4 text-center">
        <p className="text-sm text-gray-600">
          💡 Tap the card to flip between Japanese and English!
        </p>
      </Card>
    </div>
  );
};

export default VocabularyMode;
