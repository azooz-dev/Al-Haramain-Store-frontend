import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ProductViewToggle: React.FC<ProductViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="rounded-none"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}