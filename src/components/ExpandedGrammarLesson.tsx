import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { expandedLessonData } from '@/data/expandedLessonData';

interface ExpandedGrammarLessonProps {
  onComplete: () => void;
  lessonId?: string;
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

const ExpandedGrammarLesson = ({ onComplete, lessonId }: ExpandedGrammarLessonProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonContent();
  }, [lessonId]);

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

  const loadLessonContent = async () => {
    if (!lessonId) {
      // Default lesson if no ID provided
      const defaultLesson = expandedLessonData['particles-intro'];
      setLessonContent(transformStaticLessonToSections(defaultLesson));
      setLoading(false);
      return;
    }

    try {
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
          // Try to cast the Json content to our expected structure
          sections = (dbLesson.content as any[]).map((section: any) => ({
            type: section.type || 'text',
            content: section.content || section.toString(),
            examples: section.examples || undefined
          }));
        } else {
          // Fallback for non-array content
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
        // Fallback to static lessons
        const staticLesson = expandedLessonData[lessonId];
        if (staticLesson) {
          setLessonContent(transformStaticLessonToSections(staticLesson));
        } else {
          // Create a basic lesson structure for unknown lessons
          setLessonContent({
            title: `Lesson: ${lessonId}`,
            description: 'This lesson content is being prepared.',
            sections: [
              {
                type: 'text',
                content: 'This lesson is currently under development. Please check back later for complete content!'
              }
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      // Fallback to static lesson or create basic structure
      const staticLesson = expandedLessonData[lessonId || 'particles-intro'];
      if (staticLesson) {
        setLessonContent(transformStaticLessonToSections(staticLesson));
      } else {
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
      }
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

  const handleNext = () => {
    if (currentSection < lessonContent.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
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
