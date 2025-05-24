
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, BookOpen, Play, Book } from 'lucide-react';
import ExpandedGrammarLesson from '@/components/ExpandedGrammarLesson';
import ProgressTree from '@/components/ProgressTree';
import ExpandedQuizMode from '@/components/ExpandedQuizMode';
import VocabularyMode from '@/components/VocabularyMode';

type AppMode = 'home' | 'lesson' | 'quiz' | 'progress' | 'vocabulary';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 150,
    streak: 3,
    completedLessons: ['particles-intro', 'basic-structure']
  });

  const renderContent = () => {
    switch (currentMode) {
      case 'lesson':
        return <ExpandedGrammarLesson onComplete={() => setCurrentMode('home')} />;
      case 'quiz':
        return <ExpandedQuizMode onComplete={() => setCurrentMode('home')} />;
      case 'vocabulary':
        return <VocabularyMode onComplete={() => setCurrentMode('home')} />;
      case 'progress':
        return <ProgressTree progress={userProgress} onBack={() => setCurrentMode('home')} />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center space-y-4">
              <div className="text-6xl animate-float">🌸</div>
              <h1 className="text-4xl font-bold text-gray-800">Grammar Quest</h1>
              <p className="text-lg text-gray-600">Master Japanese grammar step by step!</p>
            </div>

            {/* Progress Overview */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Level {userProgress.level}</h3>
                  <p className="text-sm text-gray-600">{userProgress.xp} XP</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-kawaii-yellow">
                    🔥 {userProgress.streak} day streak
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    Beginner
                  </Badge>
                </div>
              </div>
              <Progress value={65} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">35 XP until Level 2</p>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                size="lg"
                className="h-16 bg-gradient-to-r from-kawaii-mint to-kawaii-sky hover:from-kawaii-sky hover:to-kawaii-mint text-gray-800 font-semibold"
                onClick={() => setCurrentMode('lesson')}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Continue Lesson
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-2 border-kawaii-pink bg-kawaii-pink/20 hover:bg-kawaii-pink/30 text-gray-800 font-semibold"
                  onClick={() => setCurrentMode('quiz')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Quiz
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-2 border-kawaii-lavender bg-kawaii-lavender/20 hover:bg-kawaii-lavender/30 text-gray-800 font-semibold"
                  onClick={() => setCurrentMode('vocabulary')}
                >
                  <Book className="w-5 h-5 mr-2" />
                  Vocabulary
                </Button>
              </div>
            </div>

            {/* Today's Lesson Preview */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Today's Focus: Particles & Adjectives
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-kawaii-yellow/30 rounded-lg">
                  <span className="text-sm font-medium">Grammar Points</span>
                  <span className="text-sm">は, が, を, で particles</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-kawaii-lavender/30 rounded-lg">
                  <span className="text-sm font-medium">New Vocabulary</span>
                  <span className="text-sm">8 essential words</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-kawaii-peach/30 rounded-lg">
                  <span className="text-sm font-medium">Practice Exercises</span>
                  <span className="text-sm">5 interactive quizzes</span>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setCurrentMode('progress')}
              >
                View Progress Tree
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      {renderContent()}
    </div>
  );
};

export default Index;
