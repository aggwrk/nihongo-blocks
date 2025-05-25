
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VocabularyCardProps {
  word: {
    japanese: string;
    hiragana: string;
    romaji: string;
    english: string;
    type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression';
    example?: {
      japanese: string;
      romaji: string;
      english: string;
    };
  };
  onNext?: () => void;
  showExample?: boolean;
}

const VocabularyCard = ({ word, onNext, showExample = true }: VocabularyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHiragana, setShowHiragana] = useState(false);

  const getTypeColor = () => {
    switch (word.type) {
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

  return (
    <Card className="glass-card p-6 max-w-sm mx-auto">
      <div className="space-y-4">
        {/* Type Badge */}
        <div className="flex justify-between items-center">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getTypeColor())}>
            {word.type.charAt(0).toUpperCase() + word.type.slice(1)}
          </span>
          <Button variant="ghost" size="sm" onClick={playAudio}>
            <Volume2 className="w-4 h-4" />
          </Button>
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
        {showExample && word.example && isFlipped && (
          <div className="bg-kawaii-yellow/20 rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-600">Example:</h4>
            <div className="text-sm space-y-1">
              <div className="font-medium">{word.example.japanese}</div>
              <div className="text-gray-600">{word.example.romaji}</div>
              <div className="text-gray-500">{word.example.english}</div>
            </div>
          </div>
        )}

        {/* Actions */}
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
          {onNext && (
            <Button
              onClick={onNext}
              className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
            >
              Next Word
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VocabularyCard;
