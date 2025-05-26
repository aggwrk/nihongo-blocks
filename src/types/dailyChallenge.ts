
export interface DailyChallenge {
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
