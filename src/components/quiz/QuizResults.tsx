
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';

interface QuizResultsProps {
  onBack: () => void;
  score: number;
  totalQuestions: number;
  onContinue: () => void;
}

const QuizResults = ({
  onBack,
  score,
  totalQuestions,
  onContinue
}: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const xpEarned = score * 20;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Quiz Complete!</h2>
        </div>
        <div className="w-16" />
      </div>

      <Card className="glass-card p-8 text-center">
        <div className="text-6xl mb-6">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
        </h3>
        <div className="text-lg text-gray-600 mb-6">
          You scored {score} out of {totalQuestions} ({percentage}%)
        </div>
        <div className="flex justify-center items-center space-x-2 text-yellow-500 mb-6">
          <Trophy className="w-6 h-6" />
          <span className="text-xl font-semibold">+{xpEarned} XP earned!</span>
        </div>
        <Button
          onClick={onContinue}
          className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
        >
          Continue Learning
        </Button>
      </Card>
    </div>
  );
};

export default QuizResults;
