
import { useState, useEffect } from 'react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import EnhancedVocabularyCard from './EnhancedVocabularyCard';
import VocabularyFilters from './vocabulary/VocabularyFilters';
import VocabularyProgress from './vocabulary/VocabularyProgress';
import VocabularyEmptyState from './vocabulary/VocabularyEmptyState';
import VocabularyHeader from './vocabulary/VocabularyHeader';
import VocabularyWordInfo from './vocabulary/VocabularyWordInfo';
import VocabularyLoadingState from './vocabulary/VocabularyLoadingState';

interface VocabularyModeProps {
  onComplete: () => void;
}

const VocabularyMode = ({ onComplete }: VocabularyModeProps) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vocabularyLoaded, setVocabularyLoaded] = useState(false);
  const { updateXP, updateVocabularyProgress } = useUserProgress();
  const { vocabulary, loading } = useComprehensiveVocabulary();

  // Get vocabulary filtered by level and category
  const getFilteredVocabulary = () => {
    const levelWords = vocabulary.filter(word => word.jlpt_level === selectedLevel);
    
    if (selectedCategory === 'all') {
      return levelWords;
    }
    
    return levelWords.filter(word => word.category === selectedCategory);
  };

  const filteredVocabulary = getFilteredVocabulary();

  // Get unique categories for the selected level
  const availableCategories = Array.from(
    new Set(
      vocabulary
        .filter(word => word.jlpt_level === selectedLevel && word.category)
        .map(word => word.category)
    )
  ).filter(Boolean).sort();

  const progress = filteredVocabulary.length > 0 ? ((currentWord + 1) / filteredVocabulary.length) * 100 : 0;

  // Reset currentWord when filters change
  useEffect(() => {
    setCurrentWord(0);
  }, [selectedLevel, selectedCategory]);

  // Set vocabulary as loaded when it's available
  useEffect(() => {
    if (vocabulary.length > 0 && !vocabularyLoaded) {
      setVocabularyLoaded(true);
    }
  }, [vocabulary, vocabularyLoaded]);

  const handleNext = async () => {
    const currentWordData = filteredVocabulary[currentWord];
    
    // Update vocabulary progress
    if (currentWordData) {
      await updateVocabularyProgress(currentWordData.id);
    }

    if (currentWord < filteredVocabulary.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      // Award XP for completing vocabulary practice
      await updateXP(25);
      onComplete();
      // Trigger a page refresh to update the words learned counter
      window.location.reload();
    }
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedCategory('all');
    setCurrentWord(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentWord(0);
  };

  if (loading || !vocabularyLoaded) {
    return <VocabularyLoadingState onBack={onComplete} />;
  }

  if (filteredVocabulary.length === 0) {
    return (
      <div className="space-y-6">
        <VocabularyHeader 
          onBack={onComplete}
          currentWord={0}
          totalWords={0}
        />

        <VocabularyFilters
          selectedLevel={selectedLevel}
          selectedCategory={selectedCategory}
          availableCategories={availableCategories}
          onLevelChange={handleLevelChange}
          onCategoryChange={handleCategoryChange}
        />

        <VocabularyEmptyState 
          selectedLevel={selectedLevel}
          selectedCategory={selectedCategory}
        />
      </div>
    );
  }

  const currentWordData = filteredVocabulary[currentWord];

  return (
    <div className="space-y-6">
      <VocabularyHeader 
        onBack={onComplete}
        currentWord={currentWord}
        totalWords={filteredVocabulary.length}
      />

      <VocabularyFilters
        selectedLevel={selectedLevel}
        selectedCategory={selectedCategory}
        availableCategories={availableCategories}
        onLevelChange={handleLevelChange}
        onCategoryChange={handleCategoryChange}
      />

      <VocabularyProgress progress={progress} />

      <EnhancedVocabularyCard
        word={currentWordData}
        onComplete={handleNext}
        showExample={true}
      />

      <VocabularyWordInfo word={currentWordData} />
    </div>
  );
};

export default VocabularyMode;
