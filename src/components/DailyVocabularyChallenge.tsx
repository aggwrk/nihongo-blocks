
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Calendar, Target, ArrowLeft } from 'lucide-react';
import { useDailyVocabularyChallenge } from '@/hooks/useDailyVocabularyChallenge';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import EnhancedVocabularyCard from './EnhancedVocabularyCard';

interface DailyVocabularyChallengeProps {
  onBack: () => void;
}

const DailyVocabularyChallenge = ({ onBack }: DailyVocabularyChallengeProps) => {
  const { todaysChallenge, loading: challengeLoading, markWordCompleted, getChallengeProgress } = useDailyVocabularyChallenge();
  const { vocabulary, loading: vocabularyLoading } = useComprehensiveVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const progress = getChallengeProgress();
  
  // Get current word from vocabulary based on challenge word IDs
  const getCurrentWord = () => {
    if (!todaysChallenge || !vocabulary.length) return null;
    
    const wordId = todaysChallenge.word_ids[currentWordIndex];
    if (!wordId) return null;
    
    // First try to find the word in the database vocabulary
    let word = vocabulary.find(w => w.id === wordId);
    
    // If not found in database, try to find by matching japanese text
    if (!word) {
      // Extract the word part from the ID (everything after the last underscore)
      const wordPart = wordId.split('_').pop();
      word = vocabulary.find(w => 
        w.japanese.includes(wordPart || '') || 
        w.romaji.includes(wordPart || '') ||
        w.english.toLowerCase().includes((wordPart || '').toLowerCase())
      );
    }
    
    return word;
  };

  const currentWord = getCurrentWord();
  const hasMoreWords = todaysChallenge && currentWordIndex < todaysChallenge.word_ids.length - 1;

  const handleWordComplete = async (wordId: string, masteryScore: number) => {
    if (!todaysChallenge) return;
    
    await markWordCompleted(wordId, masteryScore);
    
    if (hasMoreWords) {
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 1000);
    }
  };

  // Reset current word index when challenge changes
  useEffect(() => {
    setCurrentWordIndex(0);
  }, [todaysChallenge?.id]);

  if (challengeLoading || vocabularyLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
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
          <Button variant="ghost" onClick={onBack}>
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
          <h3 className="text-lg font-semibold mb-2">No Challenge Available</h3>
          <p className="text-gray-600 mb-4">
            We're preparing your daily vocabulary challenge. Please check back in a moment.
          </p>
          <Button onClick={onBack} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Daily Challenge</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Word Not Found</h3>
          <p className="text-gray-600 mb-4">
            Unable to load the current word. Let's skip to the next one.
          </p>
          {hasMoreWords ? (
            <Button 
              onClick={() => setCurrentWordIndex(prev => prev + 1)}
              className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
            >
              Next Word
            </Button>
          ) : (
            <Button onClick={onBack} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
              Go Back
            </Button>
          )}
        </Card>
      </div>
    );
  }

  if (todaysChallenge.is_completed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
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
          <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
          <p className="text-gray-600 mb-4">
            Great job! You've completed today's vocabulary challenge.
          </p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span>Challenge Completed</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 text-green-500 mr-2" />
              <span>{progress.completed}/{progress.total} Words</span>
            </div>
          </div>
          <Button onClick={onBack} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
            Back to Menu
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
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
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-gray-600">
            {progress.completed}/{progress.total} completed
          </span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
      </Card>

      {/* Word Card */}
      <EnhancedVocabularyCard
        word={currentWord}
        onComplete={handleWordComplete}
        challengeMode={true}
        showExample={true}
      />

      {/* Challenge Info */}
      <Card className="glass-card p-4 text-center">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Level {todaysChallenge.difficulty_level}
          </div>
          <div>
            {todaysChallenge.review_words.length > 0 && 
              `${todaysChallenge.review_words.length} review words`
            }
          </div>
          <div>
            JLPT {currentWord.jlpt_level}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Mark how well you know this word to help us personalize future challenges!
        </p>
      </Card>
    </div>
  );
};

export default DailyVocabularyChallenge;
