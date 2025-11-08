import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ReviewStarRating } from './ReviewStarRating';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { APP_CONFIG } from '@/shared/config/config';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import type { OrderItem } from '@/features/orders/types';
import type { Review } from '@/features/products/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useUsers } from '../../hooks/useUsers';
import { CreateReviewRequest } from '../../types';

interface ReviewFormProps {
  orderItem: OrderItem;
  orderId: number;
  userId: number;
  onSubmit: (review: Review | { _reviewCreated?: boolean, _itemId?: number }) => void;
  onCancel: () => void;
  onError: (error: string) => void;
  existingReview?: Review;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  orderItem,
  orderId,
  userId,
  onSubmit,
  onCancel,
  onError,
  existingReview,
}) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("reviews");
  const { t: validationT } = useSharedTranslations("validation");
  const { createReview } = useUsers();

  const formSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().nonempty(validationT("required")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: existingReview?.rating ? parseInt(existingReview.rating) : 0,
      comment: existingReview?.comment || '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>, orderId: number, itemId: number) => {
    const response = await createReview({
      userId: userId,
      orderId: orderId,
      itemId: itemId,
      rating: data.rating,
      comment: data.comment,
      locale: isRTL ? "ar" : "en",
    } as CreateReviewRequest);

    if (typeof response === "string") {
      onError(response);
    } else {
      onSubmit({
        ...response,
        _reviewCreated: true,
        _itemId: itemId,
      });
    }
  }

  const getItemImage = () => {
    if ('images' in orderItem.orderable) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${orderItem.orderable.images[0].image_url}`;
    } else if ('picture' in orderItem.orderable) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${orderItem.orderable.picture}`;
    }
    return '/placeholder-product.jpg';
  }

  const getItemTitle = () => {
    return isRTL ? orderItem.orderable.ar.title : orderItem.orderable.en.title;
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border border-amber-200 dark:border-amber-800">
      <div className={`flex items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <ImageWithFallback
          src={getItemImage()}
          alt={getItemTitle()}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="font-medium text-foreground">
            {getItemTitle()}
          </h3>
          { 'discount_price' in orderItem.orderable && orderItem.orderable.discount_price && (
            <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
              <Badge variant="secondary" className="text-xs">
                {reviewT("verifiedPurchase")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ${orderItem.orderable.discount_price}
              </span>
            </div>
          )}
          { 'offerPrice' in orderItem.orderable && orderItem.orderable.offerPrice && (
            <span className="text-sm text-muted-foreground">
              ${orderItem.orderable.offerPrice}
            </span>
          )}
          {/* Colors Display */}
          {'color' in orderItem.orderable && orderItem.orderable.color && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {reviewT("colors")}:
              </span>
              <div className="flex gap-1">
                <span
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border"
                >
                  {orderItem.orderable.color}
                </span>
              </div>
            </div>
          )}
          {/* Sizes Display */}
          {'variant' in orderItem.orderable && orderItem.orderable.variant && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {reviewT("sizes")}:
              </span>
              <div className="flex gap-1">
                <span
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border"
                >
                  {orderItem.orderable.variant}
                </span>
              </div>
            </div>
          )}
        </div>

      <form onSubmit={form.handleSubmit((data) => handleSubmit(data, orderId, orderItem.identifier))} className="space-y-6">
        {/* Rating */}
        <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <label className="text-sm font-medium text-foreground">
            {reviewT("rating")} *
          </label>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ReviewStarRating
              rating={form.watch('rating')}
              onRatingChange={(rating: number) => form.setValue('rating', rating)}
              size="lg"
            />
          </div>
        </div>

        {/* Comment */}
        <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <label className="text-sm font-medium text-foreground">
            {reviewT("yourReview")} *
          </label>
          <Textarea
            value={form.watch('comment')}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => form.setValue('comment', e.target.value)}
            placeholder={reviewT("shareYourExperience")}
            className={`min-h-[120px] resize-none bg-gray-100 dark:bg-[#121212] ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <p className="text-xs text-muted-foreground">
            {`${form.watch('comment').length}/500 (${reviewT("minimumCharacters")})`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || form.watch('rating') === 0}
            className={`bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex-1 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            {form.formState.isSubmitting ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {form.formState.isSubmitting ? reviewT("submitting") : (existingReview ? reviewT("updateReview") : reviewT("submitReview"))}
          </Button>
          
          <Button
            type="submit"
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            {reviewT("cancel")}
          </Button>
        </div>
        </form>
      </div>
    </Card>
  );
}