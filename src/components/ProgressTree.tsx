
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, CheckCircle, Play } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string | null;
  current_level: number;
  total_xp: number;
  streak_days: number;
  last_activity_date: string;
}

interface ProgressTreeProps {
  progress: UserProfile;
  completedLessons: string[];
  onBack: () => void;
  onStartLesson: (lessonId: string) => void;
}

const ProgressTree = ({ progress, completedLessons, onBack, onStartLesson }: ProgressTreeProps) => {
  const lessons = [
    {
      id: 'particles-intro',
      title: 'Introduction to Particles',
      description: 'Learn what particles are and how they work',
      xp: 50,
      level: 1,
      icon: '🔤',
      prerequisites: []
    },
    {
      id: 'basic-structure',
      title: 'Basic Sentence Structure',
      description: 'Subject + Particle + Object + Verb',
      xp: 75,
      level: 1,
      icon: '🏗️',
      prerequisites: ['particles-intro']
    },
    {
      id: 'wa-vs-ga',
      title: 'は vs が (Topic vs Subject)',
      description: 'Master the difference between wa and ga',
      xp: 100,
      level: 2,
      icon: '⚖️',
      prerequisites: ['basic-structure']
    },
    {
      id: 'object-particles',
      title: 'Object Particles (を、に、で)',
      description: 'Learn about direct objects and locations',
      xp: 125,
      level: 2,
      icon: '🎯',
      prerequisites: ['wa-vs-ga']
    },
    {
      id: 'adjectives-i-na',
      title: 'い and な Adjectives',
      description: 'Two types of adjectives in Japanese',
      xp: 150,
      level: 3,
      icon: '🎨',
      prerequisites: ['object-particles']
    },
    {
      id: 'verb-conjugation',
      title: 'Basic Verb Conjugation',
      description: 'Present, past, and negative forms',
      xp: 200,
      level: 3,
      icon: '🔄',
      prerequisites: ['adjectives-i-na']
    }
  ];

  const isLessonUnlocked = (lesson: any) => {
    if (lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every((prereq: string) => 
      completedLessons.includes(prereq)
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  const getLessonStatus = (lesson: any) => {
    if (isLessonCompleted(lesson.id)) return 'completed';
    if (isLessonUnlocked(lesson)) return 'available';
    return 'locked';
  };

  const handleStartLesson = (lessonId: string) => {
    onStartLesson(lessonId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Progress Summary */}
      <Card className="glass-card p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-kawaii-mint">{completedLessons.length}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-kawaii-pink">{progress.streak_days}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-kawaii-yellow">{lessons.length - completedLessons.length}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>
      </Card>

      {/* Lesson Tree */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson);
          const isCompleted = status === 'completed';
          const isAvailable = status === 'available';
          const isLocked = status === 'locked';

          return (
            <Card 
              key={lesson.id}
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
                  {lesson.icon}
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
                      Level {lesson.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {lesson.xp} XP
                    </Badge>
                  </div>
                </div>

                {isAvailable && !isCompleted && (
                  <Button 
                    size="sm" 
                    className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
                    onClick={() => handleStartLesson(lesson.id)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                )}
                
                {isCompleted && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStartLesson(lesson.id)}
                  >
                    Review
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Coming Soon */}
      <Card className="glass-card p-6 text-center">
        <div className="text-4xl mb-2">🚀</div>
        <h3 className="font-semibold text-gray-800 mb-2">More lessons coming soon!</h3>
        <p className="text-sm text-gray-600">
          Advanced grammar, keigo (polite language), and conversation patterns
        </p>
      </Card>
    </div>
  );
};

export default ProgressTree;
