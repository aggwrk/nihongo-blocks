import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string | null;
  current_level: number;
  total_xp: number;
  streak_days: number;
  last_activity_date: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCompletedLessons();
    } else {
      setProfile(null);
      setCompletedLessons([]);
      setLoading(false);
    }
  }, [user]);

  const calculateStreak = (lastActivityDate: string): number => {
    const today = new Date();
    const lastActivity = new Date(lastActivityDate);
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day - maintain current streak
      return 1; // Will be handled properly in updateStreak
    } else if (daysDiff === 1) {
      // Yesterday - increment streak
      return 1; // Will be incremented in updateStreak
    } else {
      // More than 1 day - reset streak
      return 1;
    }
  };

  const updateStreak = async () => {
    if (!user || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = profile.last_activity_date;
    
    if (lastActivityDate === today) {
      // Already updated today, no change needed
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    
    if (lastActivityDate === yesterdayStr) {
      // Consecutive day - increment streak
      newStreak = profile.streak_days + 1;
    } else {
      // Break in streak - reset to 1
      newStreak = 1;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          streak_days: newStreak,
          last_activity_date: today,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating streak:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      } else {
        await createProfile();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        setCompletedLessons(data?.map(item => item.lesson_id) || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateXP = async (xpGained: number) => {
    if (!user || !profile) return;

    // Update streak when gaining XP (indicates activity)
    await updateStreak();

    try {
      const newXP = profile.total_xp + xpGained;
      const newLevel = Math.floor(newXP / 200) + 1;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          total_xp: newXP,
          current_level: newLevel,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating XP:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markLessonComplete = async (lessonId: string, score?: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          score,
        });

      if (error) {
        console.error('Error marking lesson complete:', error);
      } else {
        setCompletedLessons(prev => [...new Set([...prev, lessonId])]);
        await updateStreak(); // Update streak on lesson completion
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveQuizResult = async (quizType: string, score: number, totalQuestions: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_quiz_results')
        .insert({
          user_id: user.id,
          quiz_type: quizType,
          score,
          total_questions: totalQuestions,
        });

      if (error) {
        console.error('Error saving quiz result:', error);
      } else {
        const xpGained = Math.floor((score / totalQuestions) * 50);
        await updateXP(xpGained);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateVocabularyProgress = async (wordId: string, masteryLevel: number = 1) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('user_vocabulary_progress')
          .update({
            mastery_level: Math.min(existing.mastery_level + 1, 5),
            last_practiced: new Date().toISOString(),
            times_practiced: existing.times_practiced + 1,
          })
          .eq('user_id', user.id)
          .eq('word_id', wordId);

        if (error) {
          console.error('Error updating vocabulary progress:', error);
        }
      } else {
        const { error } = await supabase
          .from('user_vocabulary_progress')
          .insert({
            user_id: user.id,
            word_id: wordId,
            mastery_level: masteryLevel,
            last_practiced: new Date().toISOString(),
            times_practiced: 1,
          });

        if (error) {
          console.error('Error creating vocabulary progress:', error);
        }
      }

      await updateStreak(); // Update streak on vocabulary practice
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { 
    profile, 
    completedLessons, 
    loading, 
    updateXP, 
    fetchProfile, 
    markLessonComplete,
    saveQuizResult,
    updateVocabularyProgress,
    updateStreak
  };
};
