
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuizLoadingStateProps {
  onBack: () => void;
}

const QuizLoadingState = ({ onBack }: QuizLoadingStateProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Quiz</h2>
        </div>
        <div className="w-16" />
      </div>
      <div className="text-center">Loading quiz questions...</div>
    </div>
  );
};

export default QuizLoadingState;
