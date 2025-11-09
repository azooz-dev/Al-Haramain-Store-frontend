import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { APP_CONFIG } from '@/shared/config/config';
import type { Review } from '@/features/products/types';
import type { OrderItem } from '@/features/orders/types';

interface ReviewItemProps {
  review: Review | { _reviewCreated?: boolean };
  item: OrderItem;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, item }) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("user");

  const renderStars = (rating: number) => {
    return Array.from({length: 5}).map((_, index: number) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getItemImage = () => {
    if ('images' in item.orderable && item.orderable.images?.[0]?.image_url) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.images[0].image_url}`;
    } else if ('picture' in item.orderable && item.orderable.picture) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.picture}`;
    }
    return '';
  }

  const getItemTitle = () => {
    return isRTL ? item.orderable.ar.title : item.orderable.en.title;
  }

    return (
    <Card 
      className={`p-6 transition-all duration-500 ease-in-out transform ${
        ('_reviewCreated' in review && review._reviewCreated) 
          ? 'opacity-100 scale-100 translate-y-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800' 
          : 'bg-background/50 border-border/50 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-600'
      }`}
    >
      <div className="space-y-4">
        {/* Product Info */}
        {item && (
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ImageWithFallback
              src={getItemImage()}
              alt={getItemTitle()}
              className="w-16 h-16 rounded-lg object-cover shadow-sm"
            />
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-medium text-foreground mb-1">
                {getItemTitle()}
                </h3>
                {('sku' in item.orderable) && item.orderable.sku && (
              <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.orderable.sku}
                    </Badge>
                  </div>
                )}
                {('_reviewCreated' in review && review._reviewCreated) && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                    {reviewT("new")}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {reviewT("previouslyReviewed")}
              </div>
            </div>
        )}
      </div>

        {/* Review Content */}
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {renderStars(Number((review as Review).rating))}
            </div>
            <span className="text-sm text-muted-foreground">
              {((review as Review).rating || 0)}/5
            </span>
          </div>

          {((review as Review).comment || '') && (
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {((review as Review).comment || '')}
            </p>
          )}

          <div className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {new Date((review as Review).createdDate || Date.now()).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
    </Card>
  );
}