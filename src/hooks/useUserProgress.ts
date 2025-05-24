
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
        // Create profile if it doesn't exist
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

    try {
      const newXP = profile.total_xp + xpGained;
      const newLevel = Math.floor(newXP / 200) + 1; // Level up every 200 XP

      const { data, error } = await supabase
        .from('profiles')
        .update({
          total_xp: newXP,
          current_level: newLevel,
          last_activity_date: new Date().toISOString().split('T')[0],
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
      }
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
    markLessonComplete 
  };
};
