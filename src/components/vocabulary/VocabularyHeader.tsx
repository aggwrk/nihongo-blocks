
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface VocabularyHeaderProps {
  onBack: () => void;
  currentWord: number;
  totalWords: number;
}

const VocabularyHeader = ({ onBack, currentWord, totalWords }: VocabularyHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="text-center">
        <h2 className="text-lg font-semibold flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Vocabulary Study
        </h2>
        <p className="text-sm text-gray-600">Word {currentWord + 1} of {totalWords}</p>
      </div>
      <div className="w-16" />
    </div>
  );
};

export default VocabularyHeader;
