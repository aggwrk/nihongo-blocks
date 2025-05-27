
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useComprehensiveVocabulary } from '@/hooks/useComprehensiveVocabulary';
import EnhancedVocabularyCard from './EnhancedVocabularyCard';

interface VocabularyModeProps {
  onComplete: () => void;
}

const VocabularyMode = ({ onComplete }: VocabularyModeProps) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vocabularyLoaded, setVocabularyLoaded] = useState(false);
  const { profile, updateXP, updateVocabularyProgress } = useUserProgress();
  const { vocabulary, loading, getVocabularyByLevelAndCategory } = useComprehensiveVocabulary();

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

  const levels = ['N5', 'N4', 'N3'];

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

  if (filteredVocabulary.length === 0) {
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

        {/* Show filters even when no vocabulary is available */}
        <Card className="glass-card p-4">
          <div className="flex items-center space-x-4 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="space-y-3">
            {/* Level Filter */}
            <div>
              <div className="text-xs text-gray-600 mb-2">JLPT Level:</div>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLevelChange(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="text-xs text-gray-600 mb-2">Category:</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                >
                  All Categories
                </Button>
                {availableCategories.slice(0, 8).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No vocabulary available</h3>
          <p className="text-gray-600">
            {selectedCategory !== 'all' 
              ? `No words found in "${selectedCategory}" category for ${selectedLevel}. Try selecting "All Categories" or a different level.`
              : `No vocabulary available for ${selectedLevel}. Try selecting a different level.`
            }
          </p>
        </Card>
      </div>
    );
  }

  const currentWordData = filteredVocabulary[currentWord];

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
            Vocabulary Study
          </h2>
          <p className="text-sm text-gray-600">Word {currentWord + 1} of {filteredVocabulary.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Filters */}
      <Card className="glass-card p-4">
        <div className="flex items-center space-x-4 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="space-y-3">
          {/* Level Filter */}
          <div>
            <div className="text-xs text-gray-600 mb-2">JLPT Level:</div>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLevelChange(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="text-xs text-gray-600 mb-2">Category:</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange('all')}
              >
                All Categories
              </Button>
              {availableCategories.slice(0, 8).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Vocabulary Card */}
      <EnhancedVocabularyCard
        word={currentWordData}
        onComplete={handleNext}
        showExample={true}
      />

      {/* Word Info */}
      <Card className="glass-card p-4 text-center">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <Badge variant="outline">{currentWordData.jlpt_level}</Badge>
          <span>Category: {currentWordData.category || 'General'}</span>
          <Badge variant="outline">{currentWordData.word_type}</Badge>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tap the card to flip between Japanese and English!
        </p>
      </Card>
    </div>
  );
};

export default VocabularyMode;
