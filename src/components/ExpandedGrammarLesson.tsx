
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { expandedLessonData } from '@/data/expandedLessonData';
import { useUserProgress } from '@/hooks/useUserProgress';

interface ExpandedGrammarLessonProps {
  onComplete: () => void;
  lessonId?: string;
  userLevel?: number;
}

interface LessonContent {
  title: string;
  description: string;
  sections: Array<{
    type: 'text' | 'example' | 'practice';
    content: string;
    examples?: Array<{
      japanese: string;
      romaji: string;
      english: string;
    }>;
  }>;
}

const ExpandedGrammarLesson = ({ onComplete, lessonId, userLevel }: ExpandedGrammarLessonProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile, updateXP } = useUserProgress();

  useEffect(() => {
    loadLessonContent();
  }, [lessonId, userLevel]);

  const transformStaticLessonToSections = (staticLesson: any): LessonContent => {
    // Transform the old 'steps' format to new 'sections' format
    if (staticLesson.steps) {
      return {
        title: staticLesson.title,
        description: staticLesson.description,
        sections: staticLesson.steps.map((step: any) => ({
          type: 'example' as const,
          content: `${step.title}\n\n${step.explanation}\n\nTip: ${step.tip}`,
          examples: step.example ? [{
            japanese: step.example.japanese,
            romaji: step.example.romaji,
            english: step.example.english
          }] : undefined
        }))
      };
    }
    return staticLesson;
  };

  const getLessonsByLevel = (level: number) => {
    const levelLessons: { [key: string]: any } = {
      1: {
        'particles-intro': expandedLessonData['particles-intro'],
        'basic-structure': {
          title: 'Basic Sentence Structure',
          description: 'Learn the fundamental structure of Japanese sentences',
          steps: [
            {
              title: 'Subject + Particle + Object + Verb',
              explanation: 'Japanese follows a specific word order that is different from English.',
              example: {
                japanese: '私は本を読みます。',
                romaji: 'Watashi wa hon wo yomimasu.',
                english: 'I read a book.'
              },
              tip: 'The verb always comes at the end in Japanese!'
            }
          ]
        }
      },
      2: {
        'wa-vs-ga': {
          title: 'は vs が (Topic vs Subject)',
          description: 'Master the difference between wa and ga particles',
          steps: [
            {
              title: 'Understanding the difference',
              explanation: 'は marks the topic of conversation, が marks the grammatical subject.',
              example: {
                japanese: '私は学生です。学生が勉強します。',
                romaji: 'Watashi wa gakusei desu. Gakusei ga benkyou shimasu.',
                english: 'I am a student. Students study.'
              },
              tip: 'Use は for general statements, が for specific actions!'
            }
          ]
        }
      },
      3: {
        'adjectives-i-na': {
          title: 'い and な Adjectives',
          description: 'Learn the two types of adjectives in Japanese',
          steps: [
            {
              title: 'Two adjective types',
              explanation: 'い-adjectives end in い, な-adjectives need な before nouns.',
              example: {
                japanese: '大きい車、きれいな花',
                romaji: 'Ookii kuruma, kirei na hana',
                english: 'Big car, beautiful flower'
              },
              tip: 'い-adjectives conjugate, な-adjectives stay the same!'
            }
          ]
        }
      }
    };

    return levelLessons[level] || levelLessons[1];
  };

  const loadLessonContent = async () => {
    try {
      const currentLevel = userLevel || profile?.current_level || 1;
      
      if (!lessonId) {
        // If no specific lesson, get appropriate lesson for user level
        const levelLessons = getLessonsByLevel(currentLevel);
        const firstLessonKey = Object.keys(levelLessons)[0];
        const defaultLesson = levelLessons[firstLessonKey];
        setLessonContent(transformStaticLessonToSections(defaultLesson));
        setLoading(false);
        return;
      }

      // First try to get from database
      const { data: dbLesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (dbLesson && !error) {
        // Transform database lesson to expected format
        let sections: LessonContent['sections'] = [];
        
        if (Array.isArray(dbLesson.content)) {
          sections = (dbLesson.content as any[]).map((section: any) => ({
            type: section.type || 'text',
            content: section.content || section.toString(),
            examples: section.examples || undefined
          }));
        } else {
          sections = [{
            type: 'text',
            content: dbLesson.description
          }];
        }

        const content: LessonContent = {
          title: dbLesson.title,
          description: dbLesson.description,
          sections: sections
        };
        setLessonContent(content);
      } else {
        // Fallback to appropriate lesson for user level
        const levelLessons = getLessonsByLevel(currentLevel);
        const staticLesson = levelLessons[lessonId] || expandedLessonData[lessonId];
        
        if (staticLesson) {
          setLessonContent(transformStaticLessonToSections(staticLesson));
        } else {
          // Create a basic lesson structure for unknown lessons
          setLessonContent({
            title: `Grammar Lesson: Level ${currentLevel}`,
            description: 'Learn Japanese grammar step by step according to your level.',
            sections: [
              {
                type: 'text',
                content: `Welcome to Level ${currentLevel} grammar! This lesson will help you understand important grammar concepts for your current level.`
              }
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      // Fallback lesson
      setLessonContent({
        title: 'Grammar Lesson',
        description: 'Learn Japanese grammar step by step',
        sections: [
          {
            type: 'text',
            content: 'Welcome to this grammar lesson! Let\'s start learning together.'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-lg font-semibold">Loading...</h2>
          </div>
          <div className="w-16" />
        </div>
        <div className="text-center">Loading lesson content...</div>
      </div>
    );
  }

  if (!lessonContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onComplete}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Lesson Not Found</h2>
          </div>
          <div className="w-16" />
        </div>

        <Card className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">Lesson content not available</h3>
          <p className="text-gray-600">This lesson is currently being prepared. Please try another lesson!</p>
          <Button onClick={onComplete} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const currentSectionData = lessonContent.sections[currentSection];
  const progress = ((currentSection + 1) / lessonContent.sections.length) * 100;

  const handleNext = async () => {
    if (currentSection < lessonContent.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Award XP for completing lesson
      await updateXP(50);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSectionContent = () => {
    switch (currentSectionData.type) {
      case 'example':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{currentSectionData.content}</p>
            {currentSectionData.examples && (
              <div className="space-y-3">
                {currentSectionData.examples.map((example, index) => (
                  <Card key={index} className="p-4 bg-kawaii-yellow/20 border border-kawaii-yellow/30">
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-gray-800">{example.japanese}</p>
                      <p className="text-sm text-gray-600">{example.romaji}</p>
                      <p className="text-sm text-kawaii-mint font-medium">{example.english}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 'practice':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{currentSectionData.content}</p>
            <Card className="p-4 bg-kawaii-lavender/20 border border-kawaii-lavender/30">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm text-gray-600">Practice exercises will be added here!</p>
              </div>
            </Card>
          </div>
        );
      default:
        return <p className="text-gray-700 leading-relaxed">{currentSectionData.content}</p>;
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
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            {lessonContent.title}
          </h2>
          <p className="text-sm text-gray-600">Section {currentSection + 1} of {lessonContent.sections.length}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Lesson Content */}
      <Card className="glass-card p-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">{lessonContent.description}</p>
        </div>

        <div className="space-y-4">
          {renderSectionContent()}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-center">
          <div className="text-xs text-gray-500">
            Progress: {Math.round(progress)}%
          </div>
        </div>

        <Button
          onClick={handleNext}
          className="bg-kawaii-mint hover:bg-kawaii-sky text-gray-800"
        >
          {currentSection === lessonContent.sections.length - 1 ? (
            <>
              Complete
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExpandedGrammarLesson;
