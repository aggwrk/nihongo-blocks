
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Play } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  level_required: number;
  category: string;
  jlpt_level?: string;
}

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isAvailable: boolean;
  onStartLesson: (lessonId: string) => void;
}

const LessonCard = ({ lesson, isCompleted, isAvailable, onStartLesson }: LessonCardProps) => {
  const isLocked = !isAvailable && !isCompleted;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'particles': return '🔤';
      case 'grammar': return '🏗️';
      case 'vocabulary': return '📚';
      case 'keigo': return '🙏';
      case 'conversation': return '💬';
      default: return '📖';
    }
  };

  return (
    <Card 
      className={`p-4 transition-all duration-300 ${
        isCompleted 
          ? 'glass-card border-kawaii-mint bg-kawaii-mint/10' 
          : isAvailable 
            ? 'glass-card border-kawaii-pink bg-kawaii-pink/10 hover:scale-[1.02]' 
            : 'bg-gray-100 border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`text-3xl ${isLocked ? 'grayscale' : ''}`}>
          {getCategoryIcon(lesson.category)}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
              {lesson.title}
            </h3>
            {isCompleted && <CheckCircle className="w-4 h-4 text-kawaii-mint" />}
            {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
          
          <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {lesson.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
              Level {lesson.level_required}
            </Badge>
            {lesson.jlpt_level && (
              <Badge variant="outline" className="text-xs">
                {lesson.jlpt_level}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {lesson.xp_reward} XP
            </Badge>
          </div>
        </div>

        {isAvailable && !isCompleted && (
          <Button 
            size="sm" 
            className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
            onClick={() => onStartLesson(lesson.id)}
          >
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
        )}
        
        {isCompleted && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onStartLesson(lesson.id)}
          >
            Review
          </Button>
        )}
      </div>
    </Card>
  );
};

export default LessonCard;
