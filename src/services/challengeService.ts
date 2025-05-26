
import { supabase } from '@/integrations/supabase/client';
import { convertSupabaseChallenge } from '@/utils/challengeDataConverters';
import { calculateDifficultyLevel, getWordsForLevel, getReviewWords, getNewWords } from '@/utils/challengeAlgorithms';
import type { DailyChallenge } from '@/types/dailyChallenge';

export const fetchTodaysChallenge = async (userId: string, today: string) => {
  const { data: existingChallenge, error: fetchError } = await supabase
    .from('daily_vocabulary_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_date', today)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching challenge:', fetchError);
    return null;
  }

  return existingChallenge ? convertSupabaseChallenge(existingChallenge) : null;
};

export const createNewChallenge = async (userId: string, today: string, vocabulary: any[]): Promise<DailyChallenge | null> => {
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
    const availableWords = getWordsForLevel(difficultyLevel, vocabulary);
    
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
        return null;
      } else {
        return convertSupabaseChallenge(newChallenge);
      }
    }
    return null;
  } catch (error) {
    console.error('Error creating new challenge:', error);
    return null;
  }
};

export const updateChallengeProgress = async (challengeId: string, wordId: string, masteryScore: number, currentChallenge: DailyChallenge): Promise<DailyChallenge | null> => {
  const updatedCompletedWords = [...currentChallenge.completed_words, wordId];
  const updatedMasteryScores = {
    ...currentChallenge.mastery_scores,
    [wordId]: masteryScore
  };
  const isCompleted = updatedCompletedWords.length === currentChallenge.word_ids.length;

  const { data, error } = await supabase
    .from('daily_vocabulary_challenges')
    .update({
      completed_words: updatedCompletedWords,
      is_completed: isCompleted,
      mastery_scores: updatedMasteryScores
    })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating challenge:', error);
    return null;
  } else {
    return convertSupabaseChallenge(data);
  }
};
