import React from 'react';
import { Clock } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ReviewStarRating } from './ReviewStarRating';
import { useApp } from '@/shared/contexts/AppContext';
import { Review, Product, ProductColor } from '@/features/products/types';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { APP_CONFIG } from '@/shared/config/config';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { formatDate } from '../order-details/orderDetailsUtils';

interface ReviewCardProps {
  review: Review;
  product: Product;
  showProductInfo?: boolean;
  authorName: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  product,
  showProductInfo = true,
  authorName,
}) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("user");

  const formattedDate = formatDate(review.createdDate, isRTL);

    return (
    <>
      <Card className="p-6 bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-border/60 rounded-xl p-4">
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Product Info (if shown) */}
          {showProductInfo && product && (
            <div className={`flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-xl flex-shrink-0 ring-1 ring-border/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ImageWithFallback
                src={product.colors[0]?.images[0]?.image_url || `${APP_CONFIG.apiBaseUrl}/storage/placeholder-product.jpg`}
                alt={isRTL ? product.ar.title : product.en.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className={`${isRTL ? 'text-right' : 'text-left'} space-y-1`}> 
                {/* Title + Price */}
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                  <h4 className="font-medium text-sm text-foreground line-clamp-1">
                    {isRTL ? product.ar.title : product.en.title}
                  </h4>
                  {typeof product.min_price === 'number' && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-background text-muted-foreground ring-1 ring-border/60">
                      ${product.min_price}
                    </span>
                  )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-1`}>
                    <span className="text-[11px] text-muted-foreground">
                      {reviewT("colors")}
                    </span>
                    <div className="flex gap-2">
                      {product.colors.slice(0, 5).map((color: ProductColor, index: number) => (
                        <div
                          key={index}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-border/60 overflow-hidden"
                          title={color.color_code}
                        >
                          <div className="w-full h-full" style={{ backgroundColor: color.color_code }} />
                        </div>
                      ))}
                      {product.colors.length > 5 && (
                        <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-1`}>
                    <span className="text-[11px] text-muted-foreground">
                      {reviewT("sizes")}
                    </span>
                    <div className="flex gap-1.5">
                      {product.available_sizes.slice(0, 4).map((size: string, index: number) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 text-[10px] rounded-md bg-background ring-1 ring-border/60 text-muted-foreground"
                        >
                          {size}
                        </span>
                      ))}
                      {product.available_sizes.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">+{product.available_sizes.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Review Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`${APP_CONFIG.apiBaseUrl}/storage/placeholder-avatar.jpg`} />
                  <AvatarFallback className="bg-amber-100 text-amber-800 text-xs dark:bg-amber-900 dark:text-amber-200">
                    {(authorName?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium text-sm text-foreground">
                      {authorName || reviewT("user")}
                    </span>
                    {review.status === 'approved' && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        {reviewT("verifiedPurchase")}
                      </Badge>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className={`mb-3 ${isRTL ? 'flex justify-end' : ''}`}>
              <ReviewStarRating 
                rating={parseInt(review.rating || '0')} 
                readOnly 
                size="md"
              />
            </div>

            {/* Comment */}
            <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-foreground leading-relaxed">
                {review.comment || ''}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}