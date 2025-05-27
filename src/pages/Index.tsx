
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Languages, Trophy, Calendar, Flame, Target, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useDailyVocabularyChallenge } from '@/hooks/useDailyVocabularyChallenge';
import { supabase } from '@/integrations/supabase/client';
import ExpandedQuizMode from '@/components/ExpandedQuizMode';
import VocabularyMode from '@/components/VocabularyMode';
import DailyVocabularyChallenge from '@/components/DailyVocabularyChallenge';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useUserProgress();
  const { todaysChallenge, loading: challengeLoading } = useDailyVocabularyChallenge();
  const [currentMode, setCurrentMode] = useState<'home' | 'quiz' | 'vocabulary' | 'daily-challenge'>('home');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompletedLessons();
    } else {
      setLessonsLoading(false);
    }
  }, [user]);

  const fetchCompletedLessons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching completed lessons:', error);
      } else {
        setCompletedLessons(data.map(item => item.lesson_id));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading skeleton only for profile, not everything
  const isInitialLoading = profileLoading && !profile;

  if (currentMode === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender to-kawaii-sky p-4">
        <div className="max-w-4xl mx-auto">
          <ExpandedQuizMode onComplete={() => setCurrentMode('home')} />
        </div>
      </div>
    );
  }

  if (currentMode === 'vocabulary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender to-kawaii-sky p-4">
        <div className="max-w-4xl mx-auto">
          <VocabularyMode onComplete={() => setCurrentMode('home')} />
        </div>
      </div>
    );
  }

  if (currentMode === 'daily-challenge') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender to-kawaii-sky p-4">
        <div className="max-w-4xl mx-auto">
          <DailyVocabularyChallenge onComplete={() => setCurrentMode('home')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender to-kawaii-sky">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                日本語を学ぼう！
              </h1>
              <p className="text-xl text-gray-600">Learn Japanese Together</p>
            </div>
            <div className="flex-1 flex justify-end">
              {user && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
          
          {/* Login button for non-authenticated users */}
          {!user && (
            <div className="mt-6">
              <Button
                onClick={() => navigate('/auth')}
                className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Get Started - Login
              </Button>
            </div>
          )}
        </div>

        {/* User Stats - only show if authenticated */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {isInitialLoading ? (
              <>
                <Card className="glass-card p-4 text-center">
                  <Skeleton className="w-8 h-8 mx-auto mb-2" />
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Skeleton className="w-8 h-8 mx-auto mb-2" />
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Skeleton className="w-8 h-8 mx-auto mb-2" />
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Skeleton className="w-8 h-8 mx-auto mb-2" />
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </Card>
              </>
            ) : profile ? (
              <>
                <Card className="glass-card p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-kawaii-mint" />
                  <div className="text-2xl font-bold text-gray-800">{profile.current_level}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold text-gray-800">{profile.total_xp}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-gray-800">{profile.streak_days}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </Card>
                <Card className="glass-card p-4 text-center">
                  <Languages className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-gray-800">
                    {lessonsLoading ? <Skeleton className="h-6 w-6 mx-auto" /> : completedLessons.length}
                  </div>
                  <div className="text-sm text-gray-600">Words Learned</div>
                </Card>
              </>
            ) : null}
          </div>
        )}

        {/* Daily Challenge Card - only show if authenticated */}
        {user && (
          <Card className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-12 h-12 text-kawaii-peach" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Daily Vocabulary Challenge</h3>
                  {challengeLoading ? (
                    <Skeleton className="h-4 w-48 mt-1" />
                  ) : (
                    <p className="text-gray-600">
                      {todaysChallenge?.is_completed 
                        ? `Completed! ${todaysChallenge.completed_words.length}/${todaysChallenge.word_ids.length} words`
                        : todaysChallenge 
                        ? `${todaysChallenge.completed_words.length}/${todaysChallenge.word_ids.length} words completed`
                        : 'Start your daily challenge!'
                      }
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {todaysChallenge?.is_completed && (
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                )}
                <Button 
                  onClick={() => setCurrentMode('daily-challenge')}
                  className="bg-kawaii-peach hover:bg-kawaii-yellow text-gray-800"
                  disabled={challengeLoading}
                >
                  {todaysChallenge?.is_completed ? 'Review' : 'Start Challenge'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Learning Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer group" onClick={() => setCurrentMode('quiz')}>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Practice Quizzes</h3>
            <p className="text-gray-600 mb-4">Test your knowledge with interactive quizzes</p>
            <Button className="w-full bg-kawaii-yellow hover:bg-kawaii-peach text-gray-800">
              <Brain className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          </Card>

          <Card className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer group" onClick={() => setCurrentMode('vocabulary')}>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎌</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Vocabulary</h3>
            <p className="text-gray-600 mb-4">Expand your Japanese vocabulary</p>
            <Button className="w-full bg-kawaii-peach hover:bg-kawaii-lavender text-gray-800">
              <Languages className="w-4 h-4 mr-2" />
              Study Words
            </Button>
          </Card>
        </div>

        {/* Level Progress - only show if authenticated and has profile */}
        {user && profile && (
          <Card className="glass-card p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Level {profile.current_level} Progress</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-kawaii-mint to-kawaii-sky h-full transition-all duration-300"
                    style={{ width: `${(profile.total_xp % 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {profile.total_xp % 100}/100 XP
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {100 - (profile.total_xp % 100)} XP until Level {profile.current_level + 1}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
