
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, BookOpen, Play, Book, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import ExpandedGrammarLesson from '@/components/ExpandedGrammarLesson';
import ProgressTree from '@/components/ProgressTree';
import ExpandedQuizMode from '@/components/ExpandedQuizMode';
import VocabularyMode from '@/components/VocabularyMode';

type AppMode = 'home' | 'lesson' | 'quiz' | 'progress' | 'vocabulary';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');
  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(undefined);
  const { user, signOut, loading } = useAuth();
  const { profile, completedLessons, loading: profileLoading, markLessonComplete, updateXP } = useUserProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-float">🌸</div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleStartLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentMode('lesson');
  };

  const handleLessonComplete = async () => {
    if (currentLessonId) {
      await markLessonComplete(currentLessonId);
      await updateXP(50); // Award XP for lesson completion
    }
    setCurrentLessonId(undefined);
    setCurrentMode('home');
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'lesson':
        return (
          <ExpandedGrammarLesson 
            onComplete={handleLessonComplete} 
            lessonId={currentLessonId}
          />
        );
      case 'quiz':
        return <ExpandedQuizMode onComplete={() => setCurrentMode('home')} />;
      case 'vocabulary':
        return <VocabularyMode onComplete={() => setCurrentMode('home')} />;
      case 'progress':
        return (
          <ProgressTree 
            progress={profile} 
            completedLessons={completedLessons} 
            onBack={() => setCurrentMode('home')}
            onStartLesson={handleStartLesson}
          />
        );
      default:
        return (
          <div className="space-y-8">
            {/* User Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-kawaii-mint rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-800" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{profile.username || 'Student'}</h2>
                  <p className="text-sm text-gray-600">Level {profile.current_level}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

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
                  <h3 className="text-lg font-semibold">Level {profile.current_level}</h3>
                  <p className="text-sm text-gray-600">{profile.total_xp} XP</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-kawaii-yellow">
                    🔥 {profile.streak_days} day streak
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    {profile.current_level < 5 ? 'Beginner' : profile.current_level < 10 ? 'Intermediate' : 'Advanced'}
                  </Badge>
                </div>
              </div>
              <Progress value={(profile.total_xp % 200) / 2} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">{200 - (profile.total_xp % 200)} XP until Level {profile.current_level + 1}</p>
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
                Today's Focus: Level {profile.current_level} Content
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-kawaii-yellow/30 rounded-lg">
                  <span className="text-sm font-medium">Grammar Points</span>
                  <span className="text-sm">Particles & Structure</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-kawaii-lavender/30 rounded-lg">
                  <span className="text-sm font-medium">New Vocabulary</span>
                  <span className="text-sm">{profile.current_level * 4} words</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-kawaii-peach/30 rounded-lg">
                  <span className="text-sm font-medium">Practice Exercises</span>
                  <span className="text-sm">Interactive quizzes</span>
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
