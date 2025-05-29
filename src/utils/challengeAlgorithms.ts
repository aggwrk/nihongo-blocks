
import { convertMasteryScores } from './challengeDataConverters';

export const calculateDifficultyLevel = (previousChallenges: any[]): number => {
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

export const getWordsForLevel = (difficultyLevel: number, vocabulary: any[]): any[] => {
  console.log('Getting words for difficulty level:', difficultyLevel, 'from vocabulary:', vocabulary.length);
  
  if (!vocabulary || vocabulary.length === 0) {
    return [];
  }
  
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

export const getReviewWords = (previousChallenges: any[]): string[] => {
  const reviewWords: string[] = [];
  
  // Find words that were answered incorrectly or need reinforcement
  previousChallenges.slice(0, 3).forEach(challenge => { // Only look at last 3 challenges
    if (!challenge.mastery_scores || !challenge.word_ids) return;
    
    const masteryScores = convertMasteryScores(challenge.mastery_scores);
    Object.entries(masteryScores).forEach(([wordId, score]) => {
      if (score < 0.7 && !reviewWords.includes(wordId)) {
        reviewWords.push(wordId);
      }
    });
    
    // Also include incomplete words from recent challenges
    const incompleteWords = (challenge.word_ids || []).filter(
      (wordId: string) => !(challenge.completed_words || []).includes(wordId)
    );
    incompleteWords.forEach((wordId: string) => {
      if (!reviewWords.includes(wordId)) {
        reviewWords.push(wordId);
      }
    });
  });
  
  return reviewWords;
};

export const getNewWords = (availableWords: any[], previousChallenges: any[], count: number): string[] => {
  if (!availableWords || availableWords.length === 0) {
    return [];
  }
  
  // Get words that haven't been used recently
  const recentlyUsedWords = new Set<string>();
  previousChallenges.slice(0, 5).forEach(challenge => { // Look at last 5 challenges
    if (challenge.word_ids) {
      challenge.word_ids.forEach((wordId: string) => recentlyUsedWords.add(wordId));
    }
  });
  
  const newWords = availableWords
    .filter(word => !recentlyUsedWords.has(word.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(word => word.id);
  
  // If we don't have enough new words, add some recently used ones
  if (newWords.length < count) {
    const additionalWords = availableWords
      .filter(word => !newWords.includes(word.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - newWords.length)
      .map(word => word.id);
    newWords.push(...additionalWords);
  }
  
  return newWords;
};
