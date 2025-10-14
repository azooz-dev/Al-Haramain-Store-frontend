import React from 'react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Slider } from '@/shared/components/ui/slider';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { Category } from '../../types';

interface ProductFiltersProps {
  selectedCategories?: number[];
  priceRange: [number, number];
  priceMaxBound: number;
  categories: Category[];
  onCategoryToggle: (categoryId: number) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategories,
  priceRange,
  priceMaxBound,
  categories,
  onCategoryToggle,
  onPriceRangeChange,
  onClearFilters,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

    return (
    <Card className="p-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {productT("filter.title")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            {productT("filter.clear")}
          </Button>
        </div>
      </CardHeader>
      
        <CardContent className="space-y-6">
        {/* Categories Filter */}
        <div>
          <h3 className="font-medium mb-3">
            {productT("filter.categories")}
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.identifier} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.identifier}`}
                  checked={selectedCategories?.includes(category.identifier) || false}
                  onCheckedChange={() => onCategoryToggle(category.identifier)}
                  className={`${isRTL ? 'ml-2' : 'mr-2'}`}
                />
                <label
                  htmlFor={`category-${category.identifier}`}
                  className={`text-sm cursor-pointer ${isRTL ? 'text-right ' : 'text-left'}`}
                >
                  { isRTL ? category.ar.title : category.en.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="font-medium mb-3">
            {productT("filter.range")}
          </h3>
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={(value: number[]) => onPriceRangeChange([value[0], value[1]])}
              max={priceMaxBound}
              step={10}
              className="w-full"
            />
            <div className={`flex justify-between text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}