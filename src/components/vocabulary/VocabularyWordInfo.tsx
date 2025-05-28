
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VocabularyWord {
  id: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  word_type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression';
  jlpt_level: string;
  category?: string;
  example_japanese?: string;
  example_romaji?: string;
  example_english?: string;
}

interface VocabularyWordInfoProps {
  word: VocabularyWord;
}

const VocabularyWordInfo = ({ word }: VocabularyWordInfoProps) => {
  return (
    <Card className="glass-card p-4 text-center">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <Badge variant="outline">{word.jlpt_level}</Badge>
        <span>Category: {word.category || 'General'}</span>
        <Badge variant="outline">{word.word_type}</Badge>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Tap the card to flip between Japanese and English!
      </p>
    </Card>
  );
};

export default VocabularyWordInfo;
