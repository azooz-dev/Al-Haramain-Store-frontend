import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ReviewFiltersProps {
  searchQuery: string;
  filterRating: number;
  sortBy: string;
  onSearchChange: (query: string) => void;
  onRatingFilterChange: (rating: number) => void;
  onSortByChange: (sort: string) => void;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  searchQuery,
  filterRating,
  sortBy,
  onSearchChange,
  onRatingFilterChange,
  onSortByChange,
}) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("reviews");

    return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className={`absolute top-1/> transform -translate-y-1/> h-4 w-4 text-muted-foreground ${
            isRTL ? 'right-3' : 'left-3'
          }`}
        />
        <Input
          placeholder={reviewT("filters.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background/50 border-border/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Rating Filter */}
      <Select value={filterRating.toString()} onValueChange={(value: string) => onRatingFilterChange(Number(value))}>
        <SelectTrigger className="w-40 bg-background/50 border-border/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200">
          <SelectValue placeholder={reviewT("filters.rating")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{reviewT("filters.all")}</SelectItem>
          <SelectItem value="5">{reviewT("filters.excellent")}</SelectItem>
          <SelectItem value="4">{reviewT("filters.veryGood")}</SelectItem>
          <SelectItem value="3">{reviewT("filters.good")}</SelectItem>
          <SelectItem value="2">{reviewT("filters.fair")}</SelectItem>
          <SelectItem value="1">{reviewT("filters.poor")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-40 bg-background/50 border-border/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200">
          <SelectValue placeholder={reviewT("filters.sort")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{reviewT("filters.newest")}</SelectItem>
          <SelectItem value="oldest">{reviewT("filters.oldest")}</SelectItem>
          <SelectItem value="rating-high">{reviewT("filters.highestRating")}</SelectItem>
          <SelectItem value="rating-low">{reviewT("filters.lowestRating")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

}