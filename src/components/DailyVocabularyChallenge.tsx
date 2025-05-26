
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Trophy, Target, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDailyVocabularyChallenge } from '@/hooks/useDailyVocabularyChallenge';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import { useUserProgress } from '@/hooks/useUserProgress';
import EnhancedVocabularyCard from './EnhancedVocabularyCard';

interface DailyVocabularyChallengeProps {
  onComplete: () => void;
}

const DailyVocabularyChallenge = ({ onComplete }: DailyVocabularyChallengeProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { todaysChallenge, loading, markWordCompleted, getChallengeProgress } = useDailyVocabularyChallenge();
  const { vocabulary } = useComprehensiveVocabulary();
  const { updateXP } = useUserProgress();

  const progress = getChallengeProgress();
  const currentWordId = todaysChallenge?.word_ids[currentWordIndex];
  const currentWord = vocabulary.find(word => word.id === currentWordId);

  const handleWordComplete = async (wordId: string, masteryScore: number) => {
    await markWordCompleted(wordId, masteryScore);
    
    // Award XP based on mastery
    const xpGain = Math.round(masteryScore * 10);
    await updateXP(xpGain);

    // Move to next word or complete challenge
    if (currentWordIndex < (todaysChallenge?.word_ids.length || 0) - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Challenge completed - award bonus XP
      await updateXP(25);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const isReviewWord = (wordId: string) => {
    return todaysChallenge?.review_words?.includes(wordId) || false;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center">Loading today's challenge...</div>
      </div>
    );
  }

  if (!todaysChallenge || !currentWord) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No challenge available</h3>
          <p className="text-gray-600">Complete some lessons first to unlock daily challenges!</p>
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
            <h2 className="text-lg font-semibold flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              Challenge Completed!
            </h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2 text-green-600">Perfect!</h3>
          <p className="text-gray-600 mb-4">
            You've completed today's vocabulary challenge!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-kawaii-mint">{progress.total}</div>
              <div className="text-xs text-gray-600">Words Studied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-kawaii-peach">{todaysChallenge.difficulty_level}</div>
              <div className="text-xs text-gray-600">Difficulty Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-kawaii-yellow">{todaysChallenge.review_words?.length || 0}</div>
              <div className="text-xs text-gray-600">Review Words</div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Come back tomorrow for a new challenge! 📅
          </p>
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
            Word {currentWordIndex + 1} of {todaysChallenge.word_ids.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Level {todaysChallenge.difficulty_level}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress.percentage} className="h-3" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{progress.completed} completed</span>
          <span>{progress.total - progress.completed} remaining</span>
        </div>
      </div>

      {/* Current Word Indicator */}
      {isReviewWord(currentWordId) && (
        <div className="flex justify-center">
          <Badge className="bg-orange-100 text-orange-800">
            <RotateCcw className="w-3 h-3 mr-1" />
            Review Word
          </Badge>
        </div>
      )}

      {/* Vocabulary Card */}
      <EnhancedVocabularyCard
        word={currentWord}
        onComplete={handleWordComplete}
        challengeMode={true}
        showExample={true}
      />

      {/* Challenge Info */}
      <Card className="glass-card p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1 text-kawaii-mint" />
              <span>New: {todaysChallenge.word_ids.length - (todaysChallenge.review_words?.length || 0)}</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-1 text-orange-500" />
              <span>Review: {todaysChallenge.review_words?.length || 0}</span>
            </div>
          </div>
          <div className="text-gray-500">
            Difficulty Level {todaysChallenge.difficulty_level}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Study each word carefully, then mark if you knew it or need more practice!
        </p>
      </Card>
    </div>
  );
};

export default DailyVocabularyChallenge;
