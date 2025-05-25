
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Trophy, Star, RotateCcw } from 'lucide-react';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useUserProgress } from '@/hooks/useUserProgress';

interface ExpandedQuizModeProps {
  onComplete: () => void;
}

const ExpandedQuizMode = ({ onComplete }: ExpandedQuizModeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const { questions, loading } = useQuizzes();
  const { profile, saveQuizResult } = useUserProgress();

  // Filter questions based on user level
  const userLevel = profile?.current_level || 1;
  const availableQuestions = questions.filter(q => {
    if (!q.jlpt_level) return q.difficulty <= userLevel;
    const levelMap = { 'N5': 1, 'N4': 2, 'N3': 3, 'N2': 4, 'N1': 5 };
    const questionLevel = levelMap[q.jlpt_level as keyof typeof levelMap] || 1;
    return questionLevel <= Math.min(userLevel, 2); // Cap at N4 for now
  }).slice(0, 10); // Limit to 10 questions

  const currentQ = availableQuestions[currentQuestion];
  const progress = availableQuestions.length > 0 ? ((currentQuestion + 1) / availableQuestions.length) * 100 : 0;

  useEffect(() => {
    if (timeLeft > 0 && !showResult && isTimerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      handleSubmit();
    }
  }, [timeLeft, showResult, isTimerActive]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setIsTimerActive(false);
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = async () => {
    if (currentQuestion < availableQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(45);
      setIsTimerActive(true);
    } else {
      // Save quiz result
      await saveQuizResult('general', score, availableQuestions.length);
      onComplete();
    }
  };

  const resetAnswer = () => {
    setSelectedAnswer('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Grammar Quiz</h2>
          </div>
          <div className="w-16" />
        </div>
        <div className="text-center">Loading questions...</div>
      </div>
    );
  }

  if (availableQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Grammar Quiz</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No quiz questions available</h3>
          <p className="text-gray-600">Complete more lessons to unlock quiz questions!</p>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    return (
      <div className="space-y-6">
        <Card className="glass-card p-8 text-center space-y-6">
          <div className="text-6xl">
            {isCorrect ? '🎉' : '😅'}
          </div>
          <h3 className="text-2xl font-bold">
            {isCorrect ? 'Perfect!' : 'Good try!'}
          </h3>
          
          <div className="space-y-4">
            <div className="bg-kawaii-mint/30 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Question:</h4>
              <p className="text-sm text-gray-700 mb-2">{currentQ.question_text}</p>
              <h4 className="font-semibold mb-2">Correct Answer:</h4>
              <p className="text-sm text-green-700 font-medium">{currentQ.correct_answer}</p>
              {currentQ.explanation && (
                <div className="mt-2">
                  <h4 className="font-semibold mb-1">Explanation:</h4>
                  <p className="text-xs text-gray-600">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {!isCorrect && (
              <div className="bg-kawaii-peach/30 rounded-xl p-4">
                <h4 className="font-semibold mb-2">Your Answer:</h4>
                <p className="text-sm text-red-700">{selectedAnswer || 'No answer selected'}</p>
              </div>
            )}
            
            {isCorrect && (
              <div className="flex items-center justify-center space-x-2 text-kawaii-mint">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">+15 XP</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleNext}
            className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
          >
            {currentQuestion === availableQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onComplete}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Grammar Quiz</h2>
          <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {availableQuestions.length}</p>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-kawaii-mint'}`}>
            {timeLeft}s
          </div>
          <div className="text-xs text-gray-600">Time left</div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Quiz Content */}
      <Card className="glass-card p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{currentQ.question_text}</h3>
          {currentQ.jlpt_level && (
            <p className="text-sm text-gray-600 mt-2">Level: {currentQ.jlpt_level}</p>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQ.options?.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`w-full p-4 text-left justify-start ${
                selectedAnswer === option 
                  ? 'bg-kawaii-mint hover:bg-kawaii-sky text-gray-800' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelect(option)}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>

        {selectedAnswer && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAnswer}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Answer
            </Button>
          </div>
        )}
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedAnswer}
        className="w-full bg-kawaii-pink hover:bg-kawaii-peach text-gray-800"
        size="lg"
      >
        Submit Answer
      </Button>

      {/* Score */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
          <Trophy className="w-4 h-4 text-kawaii-mint" />
          <span className="text-sm font-medium">Score: {score}/{availableQuestions.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpandedQuizMode;
