
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { n5Vocabulary, n4Vocabulary } from '@/data/comprehensiveVocabulary';

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

export const useComprehensiveVocabulary = () => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      // First try to load from database
      const { data: dbVocabulary, error } = await supabase
        .from('vocabulary_words')
        .select('*')
        .order('jlpt_level', { ascending: true });

      if (error) {
        console.error('Error fetching vocabulary from database:', error);
      }

      // Combine database vocabulary with local data
      const allVocabulary = [
        ...(dbVocabulary || []).map(word => ({
          ...word,
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        })),
        ...n5Vocabulary.map(word => ({ 
          ...word, 
          jlpt_level: 'N5',
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        })),
        ...n4Vocabulary.map(word => ({ 
          ...word, 
          jlpt_level: 'N4',
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        }))
      ];

      // Remove duplicates based on ID
      const uniqueVocabulary = allVocabulary.filter((word, index, self) => 
        index === self.findIndex(w => w.id === word.id)
      );

      setVocabulary(uniqueVocabulary);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      // Fallback to local data only
      const localVocabulary = [
        ...n5Vocabulary.map(word => ({ 
          ...word, 
          jlpt_level: 'N5',
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        })),
        ...n4Vocabulary.map(word => ({ 
          ...word, 
          jlpt_level: 'N4',
          word_type: word.word_type as 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression'
        }))
      ];
      setVocabulary(localVocabulary);
    } finally {
      setLoading(false);
    }
  };

  const getVocabularyByLevel = (maxLevel: number) => {
    const levelOrder = { 'N5': 1, 'N4': 2, 'N3': 3, 'N2': 4, 'N1': 5 };
    return vocabulary.filter(word => {
      const wordLevel = levelOrder[word.jlpt_level as keyof typeof levelOrder] || 1;
      return wordLevel <= maxLevel;
    });
  };

  const getVocabularyByCategory = (category: string) => {
    return vocabulary.filter(word => word.category === category);
  };

  return { 
    vocabulary, 
    loading, 
    getVocabularyByLevel, 
    getVocabularyByCategory,
    loadVocabulary 
  };
};
