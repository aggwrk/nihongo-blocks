
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: any;
  selectedAnswer: string;
  isAnswered: boolean;
  onAnswerSelect: (answer: string) => void;
}

const QuizQuestion = ({
  question,
  selectedAnswer,
  isAnswered,
  onAnswerSelect
}: QuizQuestionProps) => {
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <Card className="glass-card p-6">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Category: {question.category} • {question.jlpt_level || 'N5'}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {question.question_text}
        </h3>
      </div>

      {question.question_type === 'multiple_choice' && question.options ? (
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? isAnswered
                    ? option === question.correct_answer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-kawaii-mint bg-kawaii-mint/20'
                  : isAnswered && option === question.correct_answer
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-kawaii-mint hover:bg-kawaii-mint/10'
              }`}
            >
              <span className="font-medium">{option}</span>
              {isAnswered && option === question.correct_answer && (
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
            onChange={(e) => onAnswerSelect(e.target.value)}
            disabled={isAnswered}
            placeholder="Type your answer..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-kawaii-mint focus:outline-none"
          />
          {isAnswered && (
            <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {isCorrect ? '✅ Correct!' : `❌ Correct answer: ${question.correct_answer}`}
            </div>
          )}
        </div>
      )}

      {isAnswered && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuizQuestion;
