import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { APP_CONFIG } from '@/shared/config/config';
import type { Review, Product } from '@/features/products/types';

interface ReviewItemProps {
  review: Review | { _reviewCreated?: boolean };
  product: Product;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, product }) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("reviews");

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
        {product && (
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ImageWithFallback
              src={product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                ? `${APP_CONFIG.apiBaseUrl}/storage/${product.colors[0].images[0].image_url}`
                : '/placeholder-product.jpg'
              }
              alt={isRTL ? product.ar.title : product.en.title}
              className="w-16 h-16 rounded-lg object-cover shadow-sm"
            />
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-medium text-foreground mb-1">
                {isRTL ? product.ar.title : product.en.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {product.sku && (
                  <Badge variant="outline" className="text-xs">
                    {product.sku}
                  </Badge>
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
          </div>
        )}

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
      </div>
    </Card>
  );
}