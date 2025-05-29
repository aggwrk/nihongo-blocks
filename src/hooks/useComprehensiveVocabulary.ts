
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useComprehensiveVocabulary = () => {
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVocabulary = async () => {
    try {
      console.log('Fetching vocabulary from database...');
      const { data, error } = await supabase
        .from('vocabulary_words')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching vocabulary:', error);
        setVocabulary([]);
      } else {
        console.log('Vocabulary fetched successfully:', data?.length, 'words');
        setVocabulary(data || []);
      }
    } catch (error) {
      console.error('Error in fetchVocabulary:', error);
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchVocabulary();
  };

  useEffect(() => {
    fetchVocabulary();
  }, []);

  return {
    vocabulary,
    loading,
    refetch
  };
};
