
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Calendar, Target, ArrowLeft, RefreshCw } from 'lucide-react';
import { useDailyVocabularyChallenge } from '@/hooks/useDailyVocabularyChallenge';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import EnhancedVocabularyCard from './EnhancedVocabularyCard';

interface DailyVocabularyChallengeProps {
  onBack: () => void;
}

const DailyVocabularyChallenge = ({ onBack }: DailyVocabularyChallengeProps) => {
  const { todaysChallenge, loading: challengeLoading, markWordCompleted, getChallengeProgress, generateOrGetTodaysChallenge } = useDailyVocabularyChallenge();
  const { vocabulary, loading: vocabularyLoading, refetch: refetchVocabulary } = useComprehensiveVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Handle refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch vocabulary data
      await refetchVocabulary();
      // Regenerate today's challenge
      await generateOrGetTodaysChallenge();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check if we should automatically move to next word
  useEffect(() => {
    if (!todaysChallenge) return;
    
    const currentWordId = todaysChallenge.word_ids[currentWordIndex];
    const isCurrentWordCompleted = todaysChallenge.completed_words.includes(currentWordId);
    
    // If current word is completed and we have more words, move to next uncompleted word
    if (isCurrentWordCompleted && currentWordIndex < todaysChallenge.word_ids.length - 1) {
      // Find next uncompleted word
      let nextIndex = currentWordIndex + 1;
      while (nextIndex < todaysChallenge.word_ids.length) {
        const nextWordId = todaysChallenge.word_ids[nextIndex];
        if (!todaysChallenge.completed_words.includes(nextWordId)) {
          setCurrentWordIndex(nextIndex);
          return;
        }
        nextIndex++;
      }
    }
  }, [todaysChallenge?.completed_words, currentWordIndex, todaysChallenge?.word_ids]);

  const handleWordComplete = async (wordId: string, masteryScore: number) => {
    if (!todaysChallenge) return;
    
    await markWordCompleted(wordId, masteryScore);
    
    // Force refresh of the component state after completion
    setTimeout(() => {
      // This will trigger the useEffect to move to next word
      setCurrentWordIndex(currentWordIndex);
    }, 100);
  };

  const handleNextWord = () => {
    if (!todaysChallenge) return;
    
    // Find next uncompleted word
    let nextIndex = currentWordIndex + 1;
    while (nextIndex < todaysChallenge.word_ids.length) {
      const nextWordId = todaysChallenge.word_ids[nextIndex];
      if (!todaysChallenge.completed_words.includes(nextWordId)) {
        setCurrentWordIndex(nextIndex);
        return;
      }
      nextIndex++;
    }
    
    // If no more uncompleted words, go to first uncompleted or stay at end
    for (let i = 0; i < todaysChallenge.word_ids.length; i++) {
      const wordId = todaysChallenge.word_ids[i];
      if (!todaysChallenge.completed_words.includes(wordId)) {
        setCurrentWordIndex(i);
        return;
      }
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
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
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
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
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No Challenge Available</h3>
          <p className="text-gray-600 mb-4">
            We're preparing your daily vocabulary challenge. Try refreshing or check back in a moment.
          </p>
          <div className="flex space-x-2 justify-center">
            <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentWord || vocabulary.length === 0) {
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
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Word Not Found</h3>
          <p className="text-gray-600 mb-4">
            Unable to load vocabulary data. Please refresh to reload the challenge.
          </p>
          <div className="flex space-x-2 justify-center">
            <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {currentWordIndex < todaysChallenge.word_ids.length - 1 ? (
              <Button 
                onClick={handleNextWord}
                variant="outline"
              >
                Next Word
              </Button>
            ) : (
              <Button onClick={onBack} variant="outline">
                Go Back
              </Button>
            )}
          </div>
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
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
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

  const currentWordId = todaysChallenge.word_ids[currentWordIndex];
  const isCurrentWordCompleted = todaysChallenge.completed_words.includes(currentWordId);

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
        <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
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

      {/* Navigation Controls */}
      <Card className="glass-card p-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePreviousWord}
            disabled={currentWordIndex === 0}
            className="bg-white/50"
          >
            Previous
          </Button>
          
          <div className="text-center">
            {isCurrentWordCompleted ? (
              <div className="text-sm text-green-600 font-medium">
                ✓ Word completed!
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Complete this word to continue
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleNextWord}
            disabled={currentWordIndex >= todaysChallenge.word_ids.length - 1}
            className="bg-white/50"
          >
            Next
          </Button>
        </div>
      </Card>

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
