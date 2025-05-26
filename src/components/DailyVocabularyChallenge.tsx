
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Trophy, Calendar } from 'lucide-react';
import { useDailyVocabularyChallenge } from '@/hooks/useDailyVocabularyChallenge';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import VocabularyCard from './VocabularyCard';

interface DailyVocabularyChallengeProps {
  onComplete: () => void;
}

const DailyVocabularyChallenge = ({ onComplete }: DailyVocabularyChallengeProps) => {
  const { todaysChallenge, loading, markWordCompleted } = useDailyVocabularyChallenge();
  const { vocabulary } = useComprehensiveVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>
        <div className="text-center">Loading today's challenge...</div>
      </div>
    );
  }

  if (!todaysChallenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No challenge available</h3>
          <p className="text-gray-600">Please try again later!</p>
        </Card>
      </div>
    );
  }

  const challengeWords = todaysChallenge.word_ids
    .map(id => vocabulary.find(word => word.id === id))
    .filter(Boolean);

  if (challengeWords.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="text-lg font-semibold mb-2">Loading vocabulary...</h3>
          <p className="text-gray-600">Please wait while we prepare your challenge!</p>
        </Card>
      </div>
    );
  }

  if (todaysChallenge.is_completed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2 text-kawaii-mint">Challenge Complete!</h3>
          <p className="text-gray-600 mb-4">You've completed today's vocabulary challenge!</p>
          <div className="flex justify-center items-center space-x-2 text-yellow-500 mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">+50 XP earned!</span>
          </div>
          <Button onClick={onComplete} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
            Continue Learning
          </Button>
        </Card>
      </div>
    );
  }

  const currentWord = challengeWords[currentWordIndex];
  const progress = (todaysChallenge.completed_words.length / todaysChallenge.word_ids.length) * 100;

  const handleNext = async () => {
    if (currentWord && !todaysChallenge.completed_words.includes(currentWord.id)) {
      await markWordCompleted(currentWord.id);
    }

    if (currentWordIndex < challengeWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      onComplete();
    }
  };

  if (!currentWord) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold mb-2">Word not found</h3>
          <p className="text-gray-600">There was an issue loading this word.</p>
        </Card>
      </div>
    );
  }

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
            <Calendar className="w-4 h-4 mr-2" />
            Daily Challenge
          </h2>
          <p className="text-sm text-gray-600">
            Word {currentWordIndex + 1} of {challengeWords.length}
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{todaysChallenge.completed_words.length} completed</span>
          <span>{challengeWords.length - todaysChallenge.completed_words.length} remaining</span>
        </div>
      </div>

      {/* Challenge Stars */}
      <div className="flex justify-center space-x-1">
        {Array.from({ length: challengeWords.length }).map((_, index) => (
          <Star
            key={index}
            className={`w-6 h-6 ${
              index < todaysChallenge.completed_words.length
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Vocabulary Card */}
      <VocabularyCard
        word={{
          japanese: currentWord.japanese,
          hiragana: currentWord.hiragana,
          romaji: currentWord.romaji,
          english: currentWord.english,
          type: currentWord.word_type,
          example: currentWord.example_japanese ? {
            japanese: currentWord.example_japanese,
            romaji: currentWord.example_romaji || '',
            english: currentWord.example_english || ''
          } : undefined
        }}
        onNext={handleNext}
      />

      {/* Challenge Info */}
      <Card className="glass-card p-4 text-center">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Category: {currentWord.category || 'General'}</span>
          <span>Level: {currentWord.jlpt_level}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Complete all words to earn 50 XP and maintain your streak!
        </p>
      </Card>
    </div>
  );
};

export default DailyVocabularyChallenge;
