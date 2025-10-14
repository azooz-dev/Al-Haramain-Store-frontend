import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ProductSearchProps {
  searchQuery: string;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onFiltersToggle: () => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  searchQuery,
  showFilters,
  onSearchChange,
  onFiltersToggle,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

    return (
    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${
          isRTL ? 'right-3' : 'left-3'
        }`} />
        <Input
          placeholder={productT("search.placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Mobile Filters Toggle */}
      <Button
        variant="outline"
        onClick={onFiltersToggle}
        className="lg:hidden"
      >
        <SlidersHorizontal className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {productT("filters.toggle")}
        {showFilters && (
          <span className={`ml-2 px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground ${
            isRTL ? 'mr-2 ml-0' : ''
          }`}>
            {productT("search.activeFilters")}
          </span>
        )}
      </Button>
    </div>
  );
}