
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import VocabularyCard from './VocabularyCard';

interface VocabularyModeProps {
  onComplete: () => void;
}

const VocabularyMode = ({ onComplete }: VocabularyModeProps) => {
  const [currentWord, setCurrentWord] = useState(0);
  const { profile, updateXP, updateVocabularyProgress } = useUserProgress();
  const { getVocabularyByLevel, loading } = useComprehensiveVocabulary();

  // Get vocabulary based on user's level (N5 for levels 1-2, N4 for levels 3-5)
  const userLevel = profile?.current_level || 1;
  const jlptLevel = userLevel <= 2 ? 1 : 2; // N5 = 1, N4 = 2
  const availableWords = getVocabularyByLevel(jlptLevel);

  const progress = availableWords.length > 0 ? ((currentWord + 1) / availableWords.length) * 100 : 0;

  const handleNext = async () => {
    const currentWordData = availableWords[currentWord];
    
    // Update vocabulary progress
    if (currentWordData) {
      await updateVocabularyProgress(currentWordData.id);
    }

    if (currentWord < availableWords.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      // Award XP for completing vocabulary practice
      await updateXP(25);
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Vocabulary</h2>
          </div>
          <div className="w-16" />
        </div>
        <div className="text-center">Loading vocabulary...</div>
      </div>
    );
  }

  if (availableWords.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Vocabulary</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No vocabulary available</h3>
          <p className="text-gray-600">Complete more lessons to unlock vocabulary!</p>
        </Card>
      </div>
    );
  }

  const currentWordData = availableWords[currentWord];

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
            Vocabulary - {currentWordData.jlpt_level}
          </h2>
          <p className="text-sm text-gray-600">Word {currentWord + 1} of {availableWords.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Vocabulary Card */}
      <VocabularyCard
        word={{
          japanese: currentWordData.japanese,
          hiragana: currentWordData.hiragana,
          romaji: currentWordData.romaji,
          english: currentWordData.english,
          type: currentWordData.word_type,
          example: currentWordData.example_japanese ? {
            japanese: currentWordData.example_japanese,
            romaji: currentWordData.example_romaji || '',
            english: currentWordData.example_english || ''
          } : undefined
        }}
        onNext={handleNext}
      />

      {/* Category and Level Info */}
      <Card className="glass-card p-4 text-center">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Category: {currentWordData.category || 'General'}</span>
          <span>Level: {currentWordData.jlpt_level}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tap the card to flip between Japanese and English!
        </p>
      </Card>
    </div>
  );
};

export default VocabularyMode;
