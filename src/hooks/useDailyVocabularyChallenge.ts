
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useComprehensiveVocabulary } from './useComprehensiveVocabulary';
import { fetchTodaysChallenge, createNewChallenge, updateChallengeProgress } from '@/services/challengeService';
import type { DailyChallenge } from '@/types/dailyChallenge';

export const useDailyVocabularyChallenge = () => {
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const { vocabulary } = useComprehensiveVocabulary();

  useEffect(() => {
    generateOrGetTodaysChallenge();
  }, [vocabulary]);

  const generateOrGetTodaysChallenge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // Check if challenge already exists for today
      const existingChallenge = await fetchTodaysChallenge(user.id, today);

      if (existingChallenge) {
        setTodaysChallenge(existingChallenge);
      } else {
        const newChallenge = await createNewChallenge(user.id, today, vocabulary);
        if (newChallenge) {
          setTodaysChallenge(newChallenge);
        }
      }
    } catch (error) {
      console.error('Error in generateOrGetTodaysChallenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const markWordCompleted = async (wordId: string, masteryScore: number = 1) => {
    if (!todaysChallenge) return;

    const updatedChallenge = await updateChallengeProgress(
      todaysChallenge.id, 
      wordId, 
      masteryScore, 
      todaysChallenge
    );

    if (updatedChallenge) {
      setTodaysChallenge(updatedChallenge);
    }
  };

  const getChallengeProgress = () => {
    if (!todaysChallenge) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = todaysChallenge.completed_words.length;
    const total = todaysChallenge.word_ids.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  };

  return {
    todaysChallenge,
    loading,
    markWordCompleted,
    generateOrGetTodaysChallenge,
    getChallengeProgress
  };
};
