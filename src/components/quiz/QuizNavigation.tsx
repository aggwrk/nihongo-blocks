
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface QuizNavigationProps {
  score: number;
  totalQuestions: number;
  selectedAnswer: string;
  isAnswered: boolean;
  isLastQuestion: boolean;
  onSubmitAnswer: () => void;
  onNext: () => void;
}

const QuizNavigation = ({
  score,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  isLastQuestion,
  onSubmitAnswer,
  onNext
}: QuizNavigationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Score: {score}/{totalQuestions}
      </div>

      <div className="flex space-x-2">
        {!isAnswered ? (
          <Button
            onClick={onSubmitAnswer}
            disabled={!selectedAnswer}
            className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
          >
            {isLastQuestion ? (
              <>
                Finish Quiz
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation;
