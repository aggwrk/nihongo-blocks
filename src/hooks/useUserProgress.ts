import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      updateStreakOnLogin();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStreakOnLogin = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('last_activity_date, streak_days')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching profile for streak:', fetchError);
        return;
      }

      const lastActivityDate = currentProfile?.last_activity_date;
      let newStreakDays = currentProfile?.streak_days || 0;

      if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreakDays += 1;
        } else if (diffDays > 1) {
          // Missed days - reset streak
          newStreakDays = 1;
        }
        // If diffDays === 0, it's the same day, so keep current streak
      } else {
        // First time logging in
        newStreakDays = 1;
      }

      // Only update if it's a new day
      if (lastActivityDate !== today) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            last_activity_date: today,
            streak_days: newStreakDays
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating streak:', updateError);
        } else {
          // Refetch profile to get updated data
          fetchProfile();
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const updateXP = async (xpGained: number) => {
    if (!user || !profile) return;

    const newTotalXP = profile.total_xp + xpGained;
    const newLevel = Math.floor(newTotalXP / 100) + 1; // Level up every 100 XP

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXP,
          current_level: newLevel
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

  const updateVocabularyProgress = async (wordId: string) => {
    if (!user) return;

    try {
      // Check if vocabulary progress exists
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching vocabulary progress:', fetchError);
        return;
      }

      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_vocabulary_progress')
          .update({
            times_practiced: (existingProgress.times_practiced || 0) + 1,
            last_practiced: new Date().toISOString(),
            mastery_level: Math.min((existingProgress.mastery_level || 1) + 1, 5)
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('Error updating vocabulary progress:', updateError);
        }
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('user_vocabulary_progress')
          .insert({
            user_id: user.id,
            word_id: wordId,
            times_practiced: 1,
            last_practiced: new Date().toISOString(),
            mastery_level: 1
          });

        if (insertError) {
          console.error('Error creating vocabulary progress:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in updateVocabularyProgress:', error);
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user) return;

    try {
      // Check if lesson is already completed
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching lesson progress:', fetchError);
        return;
      }

      if (!existingProgress) {
        // Mark lesson as completed
        const { error: insertError } = await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
            score: 100
          });

        if (insertError) {
          console.error('Error marking lesson completed:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in markLessonCompleted:', error);
    }
  };

  return {
    profile,
    loading,
    updateXP,
    updateVocabularyProgress,
    markLessonCompleted,
    fetchProfile
  };
};
