
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useComprehensiveVocabulary } from './useComprehensiveVocabulary';
import { fetchTodaysChallenge, createNewChallenge, updateChallengeProgress } from '@/services/challengeService';
import type { DailyChallenge } from '@/types/dailyChallenge';

export const useDailyVocabularyChallenge = () => {
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(false); // Start with false for faster initial render
  const { vocabulary, loading: vocabularyLoading } = useComprehensiveVocabulary();

  useEffect(() => {
    // Only generate challenge if vocabulary is loaded and we don't have a challenge yet
    if (!vocabularyLoading && vocabulary.length > 0 && !todaysChallenge) {
      generateOrGetTodaysChallenge();
    }
  }, [vocabularyLoading, vocabulary.length, todaysChallenge]);

  const generateOrGetTodaysChallenge = async () => {
    if (loading) return; // Prevent duplicate calls
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Check if challenge already exists for today
      const existingChallenge = await fetchTodaysChallenge(user.id, today);

      if (existingChallenge) {
        setTodaysChallenge(existingChallenge);
      } else if (vocabulary.length > 0) { // Only create if vocabulary is available
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
    loading: loading || vocabularyLoading, // Combine loading states
    markWordCompleted,
    generateOrGetTodaysChallenge,
    getChallengeProgress
  };
};
