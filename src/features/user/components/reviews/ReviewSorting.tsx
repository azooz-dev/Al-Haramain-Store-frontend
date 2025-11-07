import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ReviewSortingProps {
  hasMore: boolean;
  hasPrev: boolean;
  onLoadMore: () => void;
  onLoadPrev: () => void;
}

export const ReviewSorting: React.FC<ReviewSortingProps> = ({ hasMore, hasPrev, onLoadMore, onLoadPrev }) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("reviews");

    return (
    <div className={`flex justify-center gap-4 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="outline"
        onClick={onLoadPrev}
        disabled={!hasPrev}
        className={`px-6 py-2 bg-background/50 border-border/50 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:border-amber-600 transition-all duration-200 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        {isRTL ? (
          <ChevronRight className="h-4 w-4 ml-2" />
        ) : (
          <ChevronLeft className="h-4 w-4 mr-2" />
        )}
        {reviewT("sorting.previous")}
      </Button>

      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={!hasMore}
        className={`px-6 py-2 bg-background/50 border-border/50 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:border-amber-600 transition-all duration-200 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        {reviewT("sorting.next")}
        {isRTL ? (
          <ChevronLeft className="h-4 w-4 mr-2" />
        ) : (
          <ChevronRight className="h-4 w-4 ml-2" />
        )}
      </Button>
    </div>
  );
}