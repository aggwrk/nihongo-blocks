
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface VocabularyFiltersProps {
  selectedLevel: string;
  selectedCategory: string;
  availableCategories: string[];
  onLevelChange: (level: string) => void;
  onCategoryChange: (category: string) => void;
}

const VocabularyFilters = ({
  selectedLevel,
  selectedCategory,
  availableCategories,
  onLevelChange,
  onCategoryChange
}: VocabularyFiltersProps) => {
  const levels = ['N5', 'N4', 'N3'];

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center space-x-4 mb-3">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <div className="space-y-3">
        {/* Level Filter */}
        <div>
          <div className="text-xs text-gray-600 mb-2">JLPT Level:</div>
          <div className="flex flex-wrap gap-2">
            {levels.map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLevelChange(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div className="text-xs text-gray-600 mb-2">Category:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('all')}
            >
              All Categories
            </Button>
            {availableCategories.slice(0, 8).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VocabularyFilters;
