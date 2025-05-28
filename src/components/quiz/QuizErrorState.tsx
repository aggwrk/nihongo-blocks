
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuizErrorStateProps {
  onBack: () => void;
  error?: string;
}

const QuizErrorState = ({ onBack, error }: QuizErrorStateProps) => {
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
      
      <Card className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold mb-2">
          {error || 'No questions available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {error || 'Please try selecting a different level or try again later.'}
        </p>
        <Button onClick={onBack} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default QuizErrorState;
