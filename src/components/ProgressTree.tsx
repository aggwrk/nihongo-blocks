
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import ProgressHeader from './progress/ProgressHeader';
import ProgressSummary from './progress/ProgressSummary';
import LessonCard from './progress/LessonCard';

interface UserProfile {
  id: string;
  username: string | null;
  current_level: number;
  total_xp: number;
  streak_days: number;
  last_activity_date: string;
}

interface ProgressTreeProps {
  progress: UserProfile;
  completedLessons: string[];
  onBack: () => void;
  onStartLesson: (lessonId: string) => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level_required: number;
  jlpt_level?: string;
  category: string;
  xp_reward: number;
  order_index: number;
}

const ProgressTree = ({ progress, completedLessons, onBack, onStartLesson }: ProgressTreeProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      // First get lessons from database
      const { data: dbLessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
      }

      // Combine with static lessons for backwards compatibility
      const staticLessons = [
        {
          id: 'particles-intro',
          title: 'Introduction to Particles',
          description: 'Learn what particles are and how they work',
          xp_reward: 50,
          level_required: 1,
          category: 'particles',
          order_index: 0
        },
        {
          id: 'basic-structure',
          title: 'Basic Sentence Structure',
          description: 'Subject + Particle + Object + Verb',
          xp_reward: 75,
          level_required: 1,
          category: 'grammar',
          order_index: 1
        },
        {
          id: 'wa-vs-ga',
          title: 'は vs が (Topic vs Subject)',
          description: 'Master the difference between wa and ga',
          xp_reward: 100,
          level_required: 2,
          category: 'particles',
          order_index: 2
        },
        {
          id: 'object-particles',
          title: 'Object Particles (を、に、で)',
          description: 'Learn about direct objects and locations',
          xp_reward: 125,
          level_required: 2,
          category: 'particles',
          order_index: 3
        },
        {
          id: 'adjectives-i-na',
          title: 'い and な Adjectives',
          description: 'Two types of adjectives in Japanese',
          xp_reward: 150,
          level_required: 3,
          category: 'grammar',
          order_index: 4
        },
        {
          id: 'verb-conjugation',
          title: 'Basic Verb Conjugation',
          description: 'Present, past, and negative forms',
          xp_reward: 200,
          level_required: 3,
          category: 'grammar',
          order_index: 5
        }
      ];

      const allLessons = [...staticLessons, ...(dbLessons || [])];
      setLessons(allLessons.sort((a, b) => a.order_index - b.order_index));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    // First lesson is always unlocked
    if (lesson.order_index === 0) return true;
    
    // Check if user level meets requirement
    if (progress.current_level < lesson.level_required) return false;
    
    // Check if previous lesson is completed
    const previousLesson = lessons.find(l => l.order_index === lesson.order_index - 1);
    if (previousLesson && !completedLessons.includes(previousLesson.id)) {
      return false;
    }
    
    return true;
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <ProgressHeader progress={progress} onBack={onBack} />
        <div className="text-center">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressHeader progress={progress} onBack={onBack} />

      <ProgressSummary 
        completedLessons={completedLessons.length}
        streakDays={progress.streak_days}
        remainingLessons={lessons.length - completedLessons.length}
      />

      {/* Lesson Tree */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const isCompleted = isLessonCompleted(lesson.id);
          const isAvailable = isLessonUnlocked(lesson);

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={isCompleted}
              isAvailable={isAvailable}
              onStartLesson={onStartLesson}
            />
          );
        })}
      </div>

      {/* Coming Soon */}
      <Card className="glass-card p-6 text-center">
        <div className="text-4xl mb-2">🚀</div>
        <h3 className="font-semibold text-gray-800 mb-2">More lessons coming soon!</h3>
        <p className="text-sm text-gray-600">
          We're continuously adding new content including advanced grammar, business Japanese, and cultural lessons
        </p>
      </Card>
    </div>
  );
};

export default ProgressTree;
