import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useComprehensiveVocabulary } from './useComprehensiveVocabulary';
import type { Json } from '@/integrations/supabase/types';

interface DailyChallenge {
  id: string;
  user_id: string;
  challenge_date: string;
  word_ids: string[];
  completed_words: string[];
  is_completed: boolean;
  difficulty_level: number;
  review_words: string[];
  mastery_scores: Record<string, number>;
}

// Helper function to safely convert Json to Record<string, number>
const convertMasteryScores = (scores: Json | null): Record<string, number> => {
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
    return {};
  }
  
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === 'number') {
      result[key] = value;
    }
  }
  return result;
};

// Helper function to convert DailyChallenge data from Supabase
const convertSupabaseChallenge = (data: any): DailyChallenge => {
  return {
    id: data.id,
    user_id: data.user_id,
    challenge_date: data.challenge_date,
    word_ids: data.word_ids || [],
    completed_words: data.completed_words || [],
    is_completed: data.is_completed || false,
    difficulty_level: data.difficulty_level || 1,
    review_words: data.review_words || [],
    mastery_scores: convertMasteryScores(data.mastery_scores)
  };
};

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
        setTodaysChallenge(convertSupabaseChallenge(existingChallenge));
      } else {
        await createNewChallenge(user.id, today);
      }
    } catch (error) {
      console.error('Error in generateOrGetTodaysChallenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChallenge = async (userId: string, today: string) => {
    try {
      // Get previous challenges to find review words
      const { data: previousChallenges } = await supabase
        .from('daily_vocabulary_challenges')
        .select('*')
        .eq('user_id', userId)
        .order('challenge_date', { ascending: false })
        .limit(7);

      // Determine user's current difficulty level based on recent performance
      const difficultyLevel = calculateDifficultyLevel(previousChallenges || []);
      
      // Get vocabulary words based on difficulty level
      const availableWords = getWordsForLevel(difficultyLevel);
      
      // Select review words from previous challenges (words that need reinforcement)
      const reviewWords = getReviewWords(previousChallenges || []);
      
      // Create a mix of new words and review words
      const newWords = getNewWords(availableWords, previousChallenges || [], 6);
      const allChallengeWords = [...reviewWords.slice(0, 4), ...newWords];
      
      if (allChallengeWords.length > 0) {
        const { data: newChallenge, error: createError } = await supabase
          .from('daily_vocabulary_challenges')
          .insert({
            user_id: userId,
            challenge_date: today,
            word_ids: allChallengeWords,
            completed_words: [],
            is_completed: false,
            difficulty_level: difficultyLevel,
            review_words: reviewWords,
            mastery_scores: {}
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating challenge:', createError);
        } else {
          setTodaysChallenge(convertSupabaseChallenge(newChallenge));
        }
      }
    } catch (error) {
      console.error('Error creating new challenge:', error);
    }
  };

  const calculateDifficultyLevel = (previousChallenges: any[]): number => {
    if (previousChallenges.length === 0) return 1;
    
    // Calculate average completion rate over last 5 challenges
    const recentChallenges = previousChallenges.slice(0, 5);
    const completionRates = recentChallenges.map(challenge => 
      challenge.completed_words.length / challenge.word_ids.length
    );
    
    const avgCompletion = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;
    
    // Adjust difficulty based on performance
    if (avgCompletion >= 0.9) return Math.min(3, (previousChallenges[0]?.difficulty_level || 1) + 1);
    if (avgCompletion >= 0.7) return previousChallenges[0]?.difficulty_level || 1;
    return Math.max(1, (previousChallenges[0]?.difficulty_level || 1) - 1);
  };

  const getWordsForLevel = (difficultyLevel: number): any[] => {
    switch (difficultyLevel) {
      case 1:
        return vocabulary.filter(word => word.jlpt_level === 'N5');
      case 2:
        return vocabulary.filter(word => ['N5', 'N4'].includes(word.jlpt_level));
      case 3:
      default:
        return vocabulary.filter(word => ['N5', 'N4', 'N3'].includes(word.jlpt_level));
    }
  };

  const getReviewWords = (previousChallenges: any[]): string[] => {
    const reviewWords: string[] = [];
    
    // Find words that were answered incorrectly or need reinforcement
    previousChallenges.forEach(challenge => {
      const masteryScores = convertMasteryScores(challenge.mastery_scores);
      Object.entries(masteryScores).forEach(([wordId, score]) => {
        if (score < 0.7 && !reviewWords.includes(wordId)) {
          reviewWords.push(wordId);
        }
      });
      
      // Also include incomplete words from recent challenges
      const incompleteWords = challenge.word_ids.filter(
        (wordId: string) => !challenge.completed_words.includes(wordId)
      );
      incompleteWords.forEach((wordId: string) => {
        if (!reviewWords.includes(wordId)) {
          reviewWords.push(wordId);
        }
      });
    });
    
    return reviewWords;
  };

  const getNewWords = (availableWords: any[], previousChallenges: any[], count: number): string[] => {
    // Get words that haven't been used recently
    const recentlyUsedWords = new Set<string>();
    previousChallenges.slice(0, 3).forEach(challenge => {
      challenge.word_ids.forEach((wordId: string) => recentlyUsedWords.add(wordId));
    });
    
    const newWords = availableWords
      .filter(word => !recentlyUsedWords.has(word.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(word => word.id);
    
    return newWords;
  };

  const markWordCompleted = async (wordId: string, masteryScore: number = 1) => {
    if (!todaysChallenge) return;

    const updatedCompletedWords = [...todaysChallenge.completed_words, wordId];
    const updatedMasteryScores = {
      ...todaysChallenge.mastery_scores,
      [wordId]: masteryScore
    };
    const isCompleted = updatedCompletedWords.length === todaysChallenge.word_ids.length;

    const { data, error } = await supabase
      .from('daily_vocabulary_challenges')
      .update({
        completed_words: updatedCompletedWords,
        is_completed: isCompleted,
        mastery_scores: updatedMasteryScores
      })
      .eq('id', todaysChallenge.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating challenge:', error);
    } else {
      setTodaysChallenge(convertSupabaseChallenge(data));
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
