import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ProductSortingProps {
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
}

export const ProductSorting: React.FC<ProductSortingProps> = ({
  sortBy,
  onSortByChange,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

  return (
    <Select value={sortBy} onValueChange={onSortByChange}>
      <SelectTrigger className={`w-48 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <SelectValue
          placeholder={productT("sorting.placeholder")} 
          // Explicitly set the value to show the selected label
          // This ensures the selected item's label is displayed
        >
          {(() => {
            switch (sortBy) {
              case "featured":
                return productT("sorting.featured");
              case "price-low":
                return productT("sorting.priceLow");
              case "price-high":
                return productT("sorting.priceHigh");
              case "rating":
                return productT("sorting.rating");
              case "newest":
                return productT("sorting.newest");
              case "oldest":
                return productT("sorting.oldest");
              default:
                return productT("sorting.placeholder");
            }
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">{productT("sorting.featured")}</SelectItem>
        <SelectItem value="price-low">{productT("sorting.priceLow")}</SelectItem>
        <SelectItem value="price-high">{productT("sorting.priceHigh")}</SelectItem>
        <SelectItem value="rating">{productT("sorting.rating")}</SelectItem>
        <SelectItem value="newest">{productT("sorting.newest")}</SelectItem>
        <SelectItem value="oldest">{productT("sorting.oldest")}</SelectItem>
      </SelectContent>
    </Select>
  );
}