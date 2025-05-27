
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Trophy } from 'lucide-react';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useUserProgress } from '@/hooks/useUserProgress';

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

  useEffect(() => {
    if (profile && !loading) {
      try {
        const levelQuestions = getQuestionsByLevelAndCategory(profile.current_level);
        
        // Filter out invalid questions
        const validQuestions = levelQuestions.filter(q => 
          q && 
          q.question_text && 
          q.correct_answer && 
          (q.question_type !== 'multiple_choice' || (q.options && Array.isArray(q.options) && q.options.length > 0))
        );
        
        if (validQuestions.length === 0) {
          setError('No valid questions available for your level. Please try again later.');
          return;
        }
        
        // Shuffle and take up to 5 questions
        const shuffled = validQuestions.sort(() => Math.random() - 0.5).slice(0, Math.min(5, validQuestions.length));
        setQuestions(shuffled);
        setError('');
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load quiz questions. Please try again.');
      }
    }
  }, [profile, loading, getQuestionsByLevelAndCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Quiz</h2>
          </div>
          <div className="w-16" />
        </div>
        <div className="text-center">Loading quiz questions...</div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Quiz</h2>
          </div>
          <div className="w-16" />
        </div>
        
        <Card className="glass-card p-8 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">
            {error || 'No questions available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'Please try selecting a different level or try again later.'}
          </p>
          <Button onClick={onComplete} className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 20; // 20 XP per correct answer

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Quiz Complete!</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-8 text-center">
          <div className="text-6xl mb-6">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
          </h3>
          <div className="text-lg text-gray-600 mb-6">
            You scored {score} out of {questions.length} ({percentage}%)
          </div>
          <div className="flex justify-center items-center space-x-2 text-yellow-500 mb-6">
            <Trophy className="w-6 h-6" />
            <span className="text-xl font-semibold">+{xpEarned} XP earned!</span>
          </div>
          <Button
            onClick={async () => {
              await updateXP(xpEarned);
              onComplete();
            }}
            className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
          >
            Continue Learning
          </Button>
        </Card>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  if (currentQuestion >= questions.length) {
    setQuizCompleted(true);
    return null;
  }

  const currentQ = questions[currentQuestion];
  
  // Safety check for current question
  if (!currentQ) {
    setError('Invalid question data. Please try again.');
    return null;
  }

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

  const isCorrect = selectedAnswer === currentQ.correct_answer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onComplete}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Level {profile?.current_level} Quiz
          </h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <Card className="glass-card p-6">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Category: {currentQ.category} • {currentQ.jlpt_level || 'N5'}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQ.question_text}
          </h3>
        </div>

        {currentQ.question_type === 'multiple_choice' && currentQ.options ? (
          <div className="space-y-3">
            {currentQ.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? isAnswered
                      ? option === currentQ.correct_answer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-kawaii-mint bg-kawaii-mint/20'
                    : isAnswered && option === currentQ.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-kawaii-mint hover:bg-kawaii-mint/10'
                }`}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && option === currentQ.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2 inline" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-kawaii-mint focus:outline-none"
            />
            {isAnswered && (
              <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {isCorrect ? '✅ Correct!' : `❌ Correct answer: ${currentQ.correct_answer}`}
              </div>
            )}
          </div>
        )}

        {isAnswered && currentQ.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {currentQ.explanation}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Score: {score}/{questions.length}
        </div>

        <div className="flex space-x-2">
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  Finish Quiz
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedQuizMode;
