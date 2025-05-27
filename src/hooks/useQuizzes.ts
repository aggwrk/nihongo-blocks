
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { quizQuestions } from '@/data/quizData';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      // Start with local quiz data for immediate availability
      const localQuestions: QuizQuestion[] = [
        // Particle questions
        ...quizQuestions.particles.map((q, index) => ({
          id: `particles_${index}`,
          category: 'particles',
          jlpt_level: 'N5',
          question_text: q.question,
          question_type: 'multiple_choice' as const,
          options: q.options,
          correct_answer: q.options[q.correct],
          explanation: q.explanation,
          difficulty: 1
        })),
        // Vocabulary questions
        ...quizQuestions.vocabulary.map((q, index) => ({
          id: `vocabulary_${index}`,
          category: 'vocabulary',
          jlpt_level: 'N5',
          question_text: q.question,
          question_type: 'multiple_choice' as const,
          options: q.options,
          correct_answer: q.options[q.correct],
          explanation: q.explanation,
          difficulty: 1
        }))
      ];

      setQuestions(localQuestions);

      // Then try to enhance with database questions
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .order('difficulty', { ascending: true });

        if (!error && data) {
          const dbQuestions = data.map(question => ({
            ...question,
            question_type: question.question_type as 'multiple_choice' | 'fill_blank' | 'translation' | 'listening',
            options: Array.isArray(question.options) ? question.options as string[] : undefined,
            difficulty: question.difficulty || 1
          }));

          // Combine database and local questions
          const allQuestions = [...dbQuestions, ...localQuestions];
          
          // Remove duplicates based on ID
          const uniqueQuestions = allQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.id === question.id)
          );

          setQuestions(uniqueQuestions);
        }
      } catch (dbError) {
        console.log('Database questions unavailable, using local data only');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
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
