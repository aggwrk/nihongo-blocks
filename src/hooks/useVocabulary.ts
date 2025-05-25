
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VocabularyWord {
  id: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  word_type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression';
  jlpt_level: string;
  category?: string;
  example_japanese?: string;
  example_romaji?: string;
  example_english?: string;
}

export const useVocabulary = () => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabulary_words')
        .select('*')
        .order('jlpt_level', { ascending: true });

      if (error) {
        console.error('Error fetching vocabulary:', error);
      } else {
        // Type assertion for the word_type field
        const typedData = (data || []).map(word => ({
          ...word,
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        }));
        setVocabulary(typedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVocabularyByLevel = (maxLevel: number) => {
    const levelOrder = { 'N5': 1, 'N4': 2, 'N3': 3, 'N2': 4, 'N1': 5 };
    return vocabulary.filter(word => {
      const wordLevel = levelOrder[word.jlpt_level as keyof typeof levelOrder] || 1;
      return wordLevel <= Math.min(maxLevel, 2); // Cap at N4 for now
    });
  };

  return { vocabulary, loading, getVocabularyByLevel };
};
