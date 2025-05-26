
import type { Json } from '@/integrations/supabase/types';
import type { DailyChallenge } from '@/types/dailyChallenge';

// Helper function to safely convert Json to Record<string, number>
export const convertMasteryScores = (scores: Json | null): Record<string, number> => {
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
export const convertSupabaseChallenge = (data: any): DailyChallenge => {
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
