
import { useState, useEffect } from 'react';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useUserProgress } from '@/hooks/useUserProgress';
import QuizHeader from './quiz/QuizHeader';
import QuizQuestion from './quiz/QuizQuestion';
import QuizResults from './quiz/QuizResults';
import QuizNavigation from './quiz/QuizNavigation';
import QuizErrorState from './quiz/QuizErrorState';
import QuizLoadingState from './quiz/QuizLoadingState';

interface ExpandedQuizModeProps {
  onComplete: () => void;
}

const ExpandedQuizMode = ({ onComplete }: ExpandedQuizModeProps) => {
  const { profile, updateXP } = useUserProgress();
  const { getQuestionsByLevelAndCategory, loading } = useQuizzes();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (profile && !loading && !isInitialized) {
      console.log('Initializing quiz questions for level:', profile.current_level);
      
      try {
        const levelQuestions = getQuestionsByLevelAndCategory(profile.current_level);
        console.log('Available questions:', levelQuestions.length);
        
        const validQuestions = levelQuestions.filter(q => {
          const hasBasicFields = q && q.question_text && q.correct_answer;
          const hasValidOptions = q.question_type !== 'multiple_choice' || 
            (q.options && Array.isArray(q.options) && q.options.length > 0);
          
          return hasBasicFields && hasValidOptions;
        });
        
        console.log('Valid questions after filtering:', validQuestions.length);
        
        if (validQuestions.length === 0) {
          setError('No questions available for your current level. Please try a different level or contact support.');
          setIsInitialized(true);
          return;
        }
        
        const shuffled = validQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(5, validQuestions.length));
        
        console.log('Selected questions for quiz:', shuffled.length);
        setQuestions(shuffled);
        setError('');
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing quiz questions:', err);
        setError('Failed to load quiz questions. Please try again.');
        setIsInitialized(true);
      }
    }
  }, [profile, loading, getQuestionsByLevelAndCategory, isInitialized]);

  if (loading || !isInitialized) {
    return <QuizLoadingState onBack={onComplete} />;
  }

  if (error || questions.length === 0) {
    return <QuizErrorState onBack={onComplete} error={error} />;
  }

  if (quizCompleted) {
    return (
      <QuizResults
        onBack={onComplete}
        score={score}
        totalQuestions={questions.length}
        onContinue={async () => {
          const xpEarned = score * 20;
          await updateXP(xpEarned);
          onComplete();
        }}
      />
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswered(true);
    if (selectedAnswer === currentQ.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="space-y-6">
      <QuizHeader
        onBack={onComplete}
        currentLevel={profile?.current_level}
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={progress}
      />

      <QuizQuestion
        question={currentQ}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onAnswerSelect={handleAnswerSelect}
      />

      <QuizNavigation
        score={score}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        isLastQuestion={currentQuestion === questions.length - 1}
        onSubmitAnswer={handleSubmitAnswer}
        onNext={handleNext}
      />
    </div>
  );
};

export default ExpandedQuizMode;
