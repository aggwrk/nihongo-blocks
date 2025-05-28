
import { Card } from '@/components/ui/card';

interface VocabularyEmptyStateProps {
  selectedLevel: string;
  selectedCategory: string;
}

const VocabularyEmptyState = ({ selectedLevel, selectedCategory }: VocabularyEmptyStateProps) => {
  return (
    <Card className="glass-card p-6 text-center">
      <div className="text-4xl mb-4">📚</div>
      <h3 className="text-lg font-semibold mb-2">No vocabulary available</h3>
      <p className="text-gray-600">
        {selectedCategory !== 'all' 
          ? `No words found in "${selectedCategory}" category for ${selectedLevel}. Try selecting "All Categories" or a different level.`
          : `No vocabulary available for ${selectedLevel}. Try selecting a different level.`
        }
      </p>
    </Card>
  );
};

export default VocabularyEmptyState;
