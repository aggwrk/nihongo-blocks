
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface VocabularyLoadingStateProps {
  onBack: () => void;
}

const VocabularyLoadingState = ({ onBack }: VocabularyLoadingStateProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
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
};

export default VocabularyLoadingState;
