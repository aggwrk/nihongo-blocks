
import { Card } from '@/components/ui/card';

interface ProgressSummaryProps {
  completedLessons: number;
  streakDays: number;
  remainingLessons: number;
}

const ProgressSummary = ({ completedLessons, streakDays, remainingLessons }: ProgressSummaryProps) => {
  return (
    <Card className="glass-card p-4">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-kawaii-mint">{completedLessons}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-kawaii-pink">{streakDays}</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-kawaii-yellow">{remainingLessons}</div>
          <div className="text-xs text-gray-600">Remaining</div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressSummary;
