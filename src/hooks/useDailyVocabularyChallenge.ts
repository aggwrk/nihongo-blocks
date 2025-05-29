
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useComprehensiveVocabulary } from './useComprehensiveVocabulary';
import { fetchTodaysChallenge, createNewChallenge, updateChallengeProgress } from '@/services/challengeService';
import type { DailyChallenge } from '@/types/dailyChallenge';

export const useDailyVocabularyChallenge = () => {
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const { vocabulary, loading: vocabularyLoading } = useComprehensiveVocabulary();

  useEffect(() => {
    // Only generate challenge when vocabulary is loaded and user is authenticated
    if (!vocabularyLoading && vocabulary.length > 0) {
      generateOrGetTodaysChallenge();
    }
  }, [vocabularyLoading, vocabulary.length]);

  const generateOrGetTodaysChallenge = async () => {
    if (loading && todaysChallenge) return; // Prevent duplicate calls
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching challenge for date:', today);

      // Check if challenge already exists for today
      const existingChallenge = await fetchTodaysChallenge(user.id, today);

      if (existingChallenge) {
        console.log('Found existing challenge:', existingChallenge.id);
        setTodaysChallenge(existingChallenge);
      } else if (vocabulary.length > 0) {
        console.log('Creating new challenge with vocabulary count:', vocabulary.length);
        const newChallenge = await createNewChallenge(user.id, today, vocabulary);
        if (newChallenge) {
          console.log('New challenge created:', newChallenge.id);
          setTodaysChallenge(newChallenge);
        } else {
          console.log('Failed to create new challenge');
        }
      } else {
        console.log('No vocabulary available for challenge creation');
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
    loading: loading || vocabularyLoading,
    markWordCompleted,
    generateOrGetTodaysChallenge,
    getChallengeProgress
  };
};
