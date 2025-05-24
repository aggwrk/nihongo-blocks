
import { cn } from '@/lib/utils';

interface GrammarBlockProps {
  text: string;
  romaji: string;
  type: 'subject' | 'particle' | 'verb' | 'adjective' | 'object';
  meaning: string;
  isDragging?: boolean;
  onClick?: () => void;
  className?: string;
}

const GrammarBlock = ({ 
  text, 
  romaji, 
  type, 
  meaning, 
  isDragging = false, 
  onClick,
  className 
}: GrammarBlockProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'subject':
        return 'bg-grammar-subject border-grammar-subject';
      case 'particle':
        return 'bg-grammar-particle border-grammar-particle';
      case 'verb':
        return 'bg-grammar-verb border-grammar-verb';
      case 'adjective':
        return 'bg-grammar-adjective border-grammar-adjective';
      case 'object':
        return 'bg-grammar-object border-grammar-object';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'subject':
        return 'Subject';
      case 'particle':
        return 'Particle';
      case 'verb':
        return 'Verb';
      case 'adjective':
        return 'Adjective';
      case 'object':
        return 'Object';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'grammar-block',
        getTypeStyles(),
        isDragging && 'scale-105 rotate-2 shadow-xl z-10',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="text-center space-y-1">
        <div className="text-2xl font-bold text-gray-800">{text}</div>
        <div className="text-xs text-gray-600">{romaji}</div>
        <div className="text-xs font-medium text-gray-700">{meaning}</div>
        <div className="text-xs bg-white/50 rounded-full px-2 py-1 text-gray-600">
          {getTypeLabel()}
        </div>
      </div>
    </div>
  );
};

export default GrammarBlock;
