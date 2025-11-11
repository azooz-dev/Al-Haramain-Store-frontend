import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ReviewsEmptyStateProps {
  onGoToProductPage?: () => void;
  isReviewableItemsEmpty?: boolean;
}

export const ReviewsEmptyState: React.FC<ReviewsEmptyStateProps> = ({ onGoToProductPage, isReviewableItemsEmpty }) => {
  const { t: reviewT } = useFeatureTranslations("user");

  if (isReviewableItemsEmpty) {
        return (
      <Card className="p-12 text-center p-4">
        <Star className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {reviewT("emptyState.title")}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {reviewT("emptyState.description")}
        </p>
        {onGoToProductPage && (
          <Button 
            onClick={onGoToProductPage}
            className="bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
          >
            {reviewT("emptyState.button")}
          </Button>
        )}
      </Card>
    );
  }
}