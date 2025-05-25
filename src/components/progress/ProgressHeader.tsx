
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string | null;
  current_level: number;
  total_xp: number;
  streak_days: number;
  last_activity_date: string;
}

interface ProgressHeaderProps {
  progress: UserProfile;
  onBack: () => void;
}

const ProgressHeader = ({ progress, onBack }: ProgressHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Progress Tree</h2>
        <p className="text-sm text-gray-600">Level {progress.current_level} • {progress.total_xp} XP</p>
      </div>
      <div className="w-16" />
    </div>
  );
};

export default ProgressHeader;
