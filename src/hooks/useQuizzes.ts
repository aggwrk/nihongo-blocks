
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: string;
  category: string;
  jlpt_level?: string;
  question_text: string;
  question_type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: number;
}

export const useQuizzes = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('difficulty', { ascending: true });

      if (error) {
        console.error('Error fetching quiz questions:', error);
      } else {
        const typedData = (data || []).map(question => ({
          ...question,
          question_type: question.question_type as 'multiple_choice' | 'fill_blank' | 'translation' | 'listening',
          options: Array.isArray(question.options) ? question.options as string[] : undefined,
          difficulty: question.difficulty || 1
        }));
        setQuestions(typedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionsByCategory = (category: string) => {
    return questions.filter(q => q.category === category);
  };

  const getQuestionsByLevel = (userLevel: number) => {
    return questions.filter(q => {
      // Filter by difficulty matching user level
      return q.difficulty <= userLevel;
    });
  };

  const getQuestionsByLevelAndCategory = (userLevel: number, category?: string) => {
    let filteredQuestions = getQuestionsByLevel(userLevel);
    
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    
    return filteredQuestions;
  };

  return { 
    questions, 
    loading, 
    getQuestionsByCategory, 
    getQuestionsByLevel,
    getQuestionsByLevelAndCategory 
  };
};
