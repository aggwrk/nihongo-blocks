
import { Progress } from '@/components/ui/progress';

interface VocabularyProgressProps {
  progress: number;
}

const VocabularyProgress = ({ progress }: VocabularyProgressProps) => {
  return <Progress value={progress} className="h-2" />;
};

export default VocabularyProgress;
