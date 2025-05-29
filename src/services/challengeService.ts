
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
    
    if (vocabulary.length === 0) {
      console.log('No vocabulary available to create challenge');
      return null;
    }
    
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
    
    // Get vocabulary words based on difficulty level with fallbacks
    let availableWords = getWordsForLevel(difficultyLevel, vocabulary);
    console.log('Available words for level:', availableWords.length);
    
    // Progressive fallback strategy
    if (availableWords.length < 5) {
      console.log('Not enough words for difficulty level, trying N5 words');
      availableWords = vocabulary.filter(word => word.jlpt_level === 'N5');
      
      if (availableWords.length < 5) {
        console.log('Not enough N5 words, using any available vocabulary');
        availableWords = vocabulary.slice();
      }
    }
    
    // If still no words, return null
    if (availableWords.length === 0) {
      console.log('No vocabulary words available at all');
      return null;
    }
    
    // Select review words from previous challenges (words that need reinforcement)
    const reviewWords = getReviewWords(previousChallenges || []);
    console.log('Review words found:', reviewWords.length);
    
    // Filter review words to ensure they exist in current vocabulary
    const validReviewWords = reviewWords.filter(reviewWordId => 
      vocabulary.some(word => word.id === reviewWordId)
    );
    console.log('Valid review words:', validReviewWords.length);
    
    // Create a mix of new words and review words
    const targetWordCount = 8;
    const maxReviewWords = Math.min(3, validReviewWords.length);
    const maxNewWords = targetWordCount - maxReviewWords;
    
    // Get new words (excluding review words)
    const newWords = getNewWords(
      availableWords.filter(word => !validReviewWords.includes(word.id)), 
      previousChallenges || [], 
      maxNewWords
    );
    console.log('New words selected:', newWords.length);
    
    // Combine review and new words
    const allChallengeWords = [
      ...validReviewWords.slice(0, maxReviewWords),
      ...newWords
    ];
    
    // Ensure we have at least 5 words
    if (allChallengeWords.length < 5) {
      // Add more words from available vocabulary if needed
      const additionalWords = availableWords
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
          review_words: validReviewWords.slice(0, maxReviewWords),
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
    
    console.log('Unable to create challenge with sufficient words');
    return null;
  } catch (error) {
    console.error('Error creating new challenge:', error);
    return null;
  }
};

export const updateChallengeProgress = async (challengeId: string, wordId: string, masteryScore: number, currentChallenge: DailyChallenge): Promise<DailyChallenge | null> => {
  // Avoid adding duplicate words to completed_words
  const updatedCompletedWords = currentChallenge.completed_words.includes(wordId) 
    ? currentChallenge.completed_words 
    : [...currentChallenge.completed_words, wordId];
    
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
