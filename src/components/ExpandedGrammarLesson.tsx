
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { expandedLessonData } from '@/data/expandedLessonData';
import GrammarBlock from './GrammarBlock';

interface ExpandedGrammarLessonProps {
  onComplete: () => void;
  lessonId?: string;
}

const ExpandedGrammarLesson = ({ onComplete, lessonId }: ExpandedGrammarLessonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { profile, updateXP } = useUserProgress();

  // Determine lesson based on user level if not specified
  const userLevel = profile?.current_level || 1;
  let defaultLessonId = 'particles-intro';
  
  if (userLevel >= 2) {
    defaultLessonId = 'particles-ga-wo';
  }
  if (userLevel >= 3) {
    defaultLessonId = 'location-particles';
  }

  const actualLessonId = lessonId || defaultLessonId;
  const lesson = expandedLessonData[actualLessonId as keyof typeof expandedLessonData];

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="glass-card p-6 text-center">
          <p>Lesson not found</p>
        </Card>
      </div>
    );
  }

  const currentLesson = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const handleNext = async () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Award XP for completing lesson
      await updateXP(50);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentLesson.example.japanese);
      utterance.lang = 'ja-JP';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onComplete}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{lesson.title}</h2>
          <p className="text-sm text-gray-600">Step {currentStep + 1} of {lesson.steps.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Lesson Content */}
      <Card className="glass-card p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{currentLesson.title}</h3>
          <p className="text-gray-600">{currentLesson.explanation}</p>
        </div>

        {/* Grammar Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Example Sentence:</h4>
            <Button variant="ghost" size="sm" onClick={playAudio}>
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="bg-white/50 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {currentLesson.example.blocks.map((block, index) => (
                <GrammarBlock
                  key={index}
                  text={block.text}
                  romaji={block.romaji}
                  type={block.type as any}
                  meaning={block.meaning}
                />
              ))}
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600">{currentLesson.example.romaji}</p>
              <p className="text-sm font-medium">{currentLesson.example.english}</p>
            </div>
          </div>
        </div>

        {/* Grammar Tip */}
        <div className="bg-kawaii-yellow/30 rounded-xl p-4 border-l-4 border-kawaii-yellow">
          <div className="flex items-start space-x-2">
            <span className="text-lg">💡</span>
            <div>
              <h5 className="font-semibold text-sm">Grammar Tip:</h5>
              <p className="text-sm text-gray-700">{currentLesson.tip}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
        >
          {currentStep === lesson.steps.length - 1 ? 'Complete' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ExpandedGrammarLesson;
