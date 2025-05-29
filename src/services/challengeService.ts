
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
    console.log('Creating new challenge with vocabulary count:', vocabulary.length);
    
    // Get previous challenges to find review words
    const { data: previousChallenges } = await supabase
      .from('daily_vocabulary_challenges')
      .select('*')
      .eq('user_id', userId)
      .order('challenge_date', { ascending: false })
      .limit(7);

    // Determine user's current difficulty level based on recent performance
    const difficultyLevel = calculateDifficultyLevel(previousChallenges || []);
    console.log('Calculated difficulty level:', difficultyLevel);
    
    // Get vocabulary words based on difficulty level
    const availableWords = getWordsForLevel(difficultyLevel, vocabulary);
    console.log('Available words for level:', availableWords.length);
    
    // If no words available for the difficulty level, fall back to N5 words
    let wordsToUse = availableWords;
    if (wordsToUse.length === 0) {
      wordsToUse = vocabulary.filter(word => word.jlpt_level === 'N5');
      console.log('Falling back to N5 words:', wordsToUse.length);
    }
    
    // If still no words, use any available vocabulary
    if (wordsToUse.length === 0) {
      wordsToUse = vocabulary.slice(0, 10); // Take first 10 words as fallback
      console.log('Using fallback vocabulary:', wordsToUse.length);
    }
    
    // Select review words from previous challenges (words that need reinforcement)
    const reviewWords = getReviewWords(previousChallenges || []);
    console.log('Review words:', reviewWords.length);
    
    // Create a mix of new words and review words
    const maxNewWords = Math.max(5, 8 - reviewWords.length); // Ensure at least 5 words total
    const newWords = getNewWords(wordsToUse, previousChallenges || [], maxNewWords);
    console.log('New words selected:', newWords.length);
    
    // Combine review and new words, ensure minimum of 5 words
    const allChallengeWords = [...reviewWords.slice(0, 3), ...newWords];
    
    // If we still don't have enough words, add more from available vocabulary
    if (allChallengeWords.length < 5 && wordsToUse.length > 0) {
      const additionalWords = wordsToUse
        .filter(word => !allChallengeWords.includes(word.id))
        .slice(0, 5 - allChallengeWords.length)
        .map(word => word.id);
      allChallengeWords.push(...additionalWords);
    }
    
    console.log('Final challenge words:', allChallengeWords.length);
    
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
          review_words: reviewWords.slice(0, 3),
          mastery_scores: {}
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating challenge:', createError);
        return null;
      } else {
        console.log('Challenge created successfully:', newChallenge.id);
        return convertSupabaseChallenge(newChallenge);
      }
    }
    
    console.log('No words available for challenge creation');
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
