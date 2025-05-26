
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VocabularyWord {
  id: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  word_type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression';
  category?: string;
  example_japanese?: string;
  example_romaji?: string;
  example_english?: string;
}

interface EnhancedVocabularyCardProps {
  word: VocabularyWord;
  onComplete?: (wordId: string, masteryScore: number) => void;
  showExample?: boolean;
  challengeMode?: boolean;
}

const EnhancedVocabularyCard = ({ 
  word, 
  onComplete, 
  showExample = true, 
  challengeMode = false 
}: EnhancedVocabularyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHiragana, setShowHiragana] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const getTypeColor = () => {
    switch (word.word_type) {
      case 'noun': return 'bg-grammar-subject';
      case 'verb': return 'bg-grammar-verb';
      case 'adjective': return 'bg-grammar-adjective';
      case 'adverb': return 'bg-kawaii-lavender';
      case 'particle': return 'bg-grammar-particle';
      case 'expression': return 'bg-kawaii-peach';
      default: return 'bg-gray-100';
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.japanese);
      utterance.lang = 'ja-JP';
      speechSynthesis.speak(utterance);
    }
  };

  const handleMasteryChoice = (correct: boolean) => {
    const masteryScore = correct ? 1 : 0.3;
    setHasAnswered(true);
    onComplete?.(word.id, masteryScore);
  };

  return (
    <Card className="glass-card p-6 max-w-sm mx-auto">
      <div className="space-y-4">
        {/* Type Badge and Audio */}
        <div className="flex justify-between items-center">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getTypeColor())}>
            {word.word_type.charAt(0).toUpperCase() + word.word_type.slice(1)}
          </span>
          <div className="flex items-center space-x-2">
            {word.category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {word.category}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={playAudio}>
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="text-center space-y-3 cursor-pointer min-h-[120px] flex flex-col justify-center"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {!isFlipped ? (
            <>
              <div className="text-4xl font-bold text-gray-800">{word.japanese}</div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHiragana(!showHiragana);
                  }}
                  className="text-sm text-gray-600"
                >
                  {showHiragana ? word.hiragana : 'Show reading'}
                </Button>
                <div className="text-sm text-gray-500">{word.romaji}</div>
              </div>
              <div className="text-xs text-gray-400">Tap to reveal meaning</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-kawaii-mint">{word.english}</div>
              <div className="text-lg text-gray-700">{word.japanese}</div>
              <div className="text-sm text-gray-500">{word.romaji}</div>
            </>
          )}
        </div>

        {/* Example Sentence */}
        {showExample && word.example_japanese && isFlipped && (
          <div className="bg-kawaii-yellow/20 rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-600">Example:</h4>
            <div className="text-sm space-y-1">
              <div className="font-medium">{word.example_japanese}</div>
              <div className="text-gray-600">{word.example_romaji}</div>
              <div className="text-gray-500">{word.example_english}</div>
            </div>
          </div>
        )}

        {/* Challenge Mode Actions */}
        {challengeMode && isFlipped && !hasAnswered && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleMasteryChoice(false)}
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Difficult
            </Button>
            <Button
              onClick={() => handleMasteryChoice(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Got it!
            </Button>
          </div>
        )}

        {/* Regular Actions */}
        {!challengeMode && (
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFlipped(false)}
              disabled={!isFlipped}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            {onComplete && (
              <Button
                onClick={() => onComplete(word.id, 1)}
                className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
              >
                Next Word
              </Button>
            )}
          </div>
        )}

        {hasAnswered && challengeMode && (
          <div className="text-center">
            <div className="text-sm text-gray-600">Response recorded!</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedVocabularyCard;
