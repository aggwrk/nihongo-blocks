
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Brain } from 'lucide-react';

interface QuizHeaderProps {
  onBack: () => void;
  currentLevel?: number;
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
}

const QuizHeader = ({
  onBack,
  currentLevel,
  currentQuestion,
  totalQuestions,
  progress
}: QuizHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Level {currentLevel} Quiz
          </h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
        </div>
        <div className="w-16" />
      </div>

      <Progress value={progress} className="h-2" />
    </>
  );
};

export default QuizHeader;
