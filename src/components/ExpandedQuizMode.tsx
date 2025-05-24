
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Trophy, Star, RotateCcw } from 'lucide-react';
import GrammarBlock from './GrammarBlock';
import { quizData } from '@/data/lessonData';

interface ExpandedQuizModeProps {
  onComplete: () => void;
}

const ExpandedQuizMode = ({ onComplete }: ExpandedQuizModeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const currentQ = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !showResult && isTimerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      handleSubmit();
    }
  }, [timeLeft, showResult, isTimerActive]);

  const handleBlockClick = (text: string) => {
    if (selectedBlocks.includes(text)) {
      setSelectedBlocks(selectedBlocks.filter(block => block !== text));
    } else {
      setSelectedBlocks([...selectedBlocks, text]);
    }
  };

  const handleSubmit = () => {
    setIsTimerActive(false);
    const isCorrect = JSON.stringify(selectedBlocks) === JSON.stringify(currentQ.correctOrder);
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedBlocks([]);
      setShowResult(false);
      setTimeLeft(45);
      setIsTimerActive(true);
    } else {
      onComplete();
    }
  };

  const resetAnswer = () => {
    setSelectedBlocks([]);
  };

  if (showResult) {
    const isCorrect = JSON.stringify(selectedBlocks) === JSON.stringify(currentQ.correctOrder);
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
              <h4 className="font-semibold mb-2">Correct Answer:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentQ.correctOrder.map((text, index) => {
                  const block = currentQ.blocks.find(b => b.text === text)!;
                  return (
                    <GrammarBlock
                      key={index}
                      text={block.text}
                      romaji={block.romaji}
                      type={block.type}
                      meaning={block.meaning}
                      className="scale-75"
                    />
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-2">{currentQ.translation}</p>
            </div>

            {!isCorrect && (
              <div className="bg-kawaii-peach/30 rounded-xl p-4">
                <h4 className="font-semibold mb-2">Your Answer:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedBlocks.map((text, index) => {
                    const block = currentQ.blocks.find(b => b.text === text)!;
                    return (
                      <GrammarBlock
                        key={index}
                        text={block.text}
                        romaji={block.romaji}
                        type={block.type}
                        meaning={block.meaning}
                        className="scale-75"
                      />
                    );
                  })}
                </div>
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
            {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
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
          <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {quizData.length}</p>
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
          <h3 className="text-lg font-semibold text-gray-800">{currentQ.prompt}</h3>
        </div>

        {/* Selected Blocks (Answer Area) */}
        <div className="bg-white/50 rounded-xl p-4 min-h-[120px] border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Your Answer:</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAnswer}
              disabled={selectedBlocks.length === 0}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedBlocks.map((text, index) => {
              const block = currentQ.blocks.find(b => b.text === text)!;
              return (
                <GrammarBlock
                  key={index}
                  text={block.text}
                  romaji={block.romaji}
                  type={block.type}
                  meaning={block.meaning}
                  onClick={() => handleBlockClick(text)}
                  className="scale-90"
                />
              );
            })}
          </div>
        </div>

        {/* Available Blocks */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Available Blocks:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {currentQ.blocks
              .filter(block => !selectedBlocks.includes(block.text))
              .map((block, index) => (
                <GrammarBlock
                  key={index}
                  text={block.text}
                  romaji={block.romaji}
                  type={block.type}
                  meaning={block.meaning}
                  onClick={() => handleBlockClick(block.text)}
                  className="scale-90"
                />
              ))}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={selectedBlocks.length !== currentQ.correctOrder.length}
        className="w-full bg-kawaii-pink hover:bg-kawaii-peach text-gray-800"
        size="lg"
      >
        Submit Answer
      </Button>

      {/* Score */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
          <Trophy className="w-4 h-4 text-kawaii-mint" />
          <span className="text-sm font-medium">Score: {score}/{quizData.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpandedQuizMode;
