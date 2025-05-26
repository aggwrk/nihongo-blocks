
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useComprehensiveVocabulary } from './useComprehensiveVocabulary';

interface DailyChallenge {
  id: string;
  user_id: string;
  challenge_date: string;
  word_ids: string[];
  completed_words: string[];
  is_completed: boolean;
}

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
      const { data: existingChallenge, error: fetchError } = await supabase
        .from('daily_vocabulary_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_date', today)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching challenge:', fetchError);
        return;
      }

      if (existingChallenge) {
        setTodaysChallenge(existingChallenge);
      } else {
        // Create new challenge with 10 random words
        const shuffledWords = [...vocabulary].sort(() => Math.random() - 0.5);
        const challengeWords = shuffledWords.slice(0, 10).map(word => word.id);

        if (challengeWords.length > 0) {
          const { data: newChallenge, error: createError } = await supabase
            .from('daily_vocabulary_challenges')
            .insert({
              user_id: user.id,
              challenge_date: today,
              word_ids: challengeWords,
              completed_words: [],
              is_completed: false
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating challenge:', createError);
          } else {
            setTodaysChallenge(newChallenge);
          }
        }
      }
    } catch (error) {
      console.error('Error in generateOrGetTodaysChallenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const markWordCompleted = async (wordId: string) => {
    if (!todaysChallenge) return;

    const updatedCompletedWords = [...todaysChallenge.completed_words, wordId];
    const isCompleted = updatedCompletedWords.length === todaysChallenge.word_ids.length;

    const { data, error } = await supabase
      .from('daily_vocabulary_challenges')
      .update({
        completed_words: updatedCompletedWords,
        is_completed: isCompleted
      })
      .eq('id', todaysChallenge.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating challenge:', error);
    } else {
      setTodaysChallenge(data);
    }
  };

  return {
    todaysChallenge,
    loading,
    markWordCompleted,
    generateOrGetTodaysChallenge
  };
};
