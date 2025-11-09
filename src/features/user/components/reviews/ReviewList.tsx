import React, { useState, useEffect, useMemo } from 'react';
import { Star, Package } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { ReviewForm } from './ReviewForm';
import { ReviewFilters } from './ReviewFilters';
import { ReviewItem } from './ReviewItem';
import { ReviewsEmptyState } from './ReviewsEmptyState';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useUsers } from '../../hooks/useUsers';
import { Review } from '@/features/products/types';
import { OrderItem } from '@/features/orders/types';
import { APP_CONFIG } from '@/shared/config/config';
import { useNavigation } from '@/shared/hooks/useNavigation';

interface ReviewListProps {
  reviews: Review[];
  userId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  userId,
}) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("user");
  const { navigateToProducts } = useNavigation();
  const { userOrdersData, isLoadingUserOrders: isOrdersLoading, userOrdersError: ordersError } = useUsers();
  const orders = userOrdersData?.data.data;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<{ item: OrderItem, orderId: string } | null>(null);

  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [localReviewableItems, setLocalReviewableItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (orders) {
      setLocalReviewableItems(orders.flatMap((order) => order.items));
    }
    setLocalReviews(reviews);
  }, [reviews, orders]);

  const deliveredItems: OrderItem[] = useMemo(() => {
    return orders?.filter((order) => order.status === "delivered" && order.items.some((item) => !('is_reviewed' in item && item.is_reviewed))).flatMap((order) => order.items) || [];
  }, [orders]);

  const filteredAndSortedReviews = useMemo(() => {
    return localReviews.filter((review) => {
      const item = deliveredItems.find((item) => item.identifier === review.item.identifier);
      return item && !('is_reviewed' in item && item.is_reviewed) && (searchQuery.length === 0 || (isRTL ? item.orderable.ar.title.toLowerCase().includes(searchQuery.toLowerCase()) : item.orderable.en.title.toLowerCase().includes(searchQuery.toLowerCase())));
    }).sort((a: Review, b: Review) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case "oldest":
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case "rating-high":
          return Number(b.rating) - Number(a.rating);
        case "rating-low":
          return Number(a.rating) - Number(b.rating);
        default:
          return 0;
      }
    });
  }, [localReviews, deliveredItems, sortBy, searchQuery, isRTL]);

  const handleStartReview = (item: OrderItem, orderId: string) => {
    setSelectedOrderItem({ item, orderId });
    setShowReviewForm(true);
  }


  const handleSuccessfulReviewCreation = (review: Review & { _reviewCreated?: boolean, _itemId?: number }) => {
    if (review._reviewCreated && review._itemId) {
      setLocalReviews((prev) => [...prev, review]);

      setLocalReviewableItems(prev => {
        const itemToRemove = prev.find(item => item.identifier === review._itemId);
        if (itemToRemove) {
          const newItems = prev.filter(item => item.identifier !== review._itemId);
          
          setTimeout(() => {
            setLocalReviewableItems(current => current.filter(item => item.identifier !== review._itemId));
          }, 300);
          return newItems;
        }
        return prev;
      });
    }
  }

  const handleSubmitReview = (review: Review & { _reviewCreated?: boolean, _itemId?: number }) => {
    if (review._reviewCreated && review._itemId) {
      handleSuccessfulReviewCreation(review);

      setShowReviewForm(false);
      setSelectedOrderItem(null as unknown as { item: OrderItem, orderId: string });
    } else {
      setShowReviewForm(false);
      setSelectedOrderItem(null as unknown as { item: OrderItem, orderId: string });
    }
  }

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setSelectedOrderItem(null as unknown as { item: OrderItem, orderId: string });
  }

  const getItemImage = (item: OrderItem) => {
    if ('images' in item.orderable && item.orderable.images?.[0]?.image_url) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.images[0].image_url}`;
    } else if ('picture' in item.orderable && item.orderable.picture) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.picture}`;
    }
    return '';
  }

  const getItemTitle = (item: OrderItem) => {
    return isRTL ? item.orderable.ar.title : item.orderable.en.title;
  }

  if (!userId) {
        return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star className="w-6 h-6 text-amber-600" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-semibold text-foreground">
              {reviewT("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {reviewT("description")}
            </p>
          </div>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {reviewT("emptyState.description")}
          </p>
        </Card>
      </div>
    );
  }

  if (isOrdersLoading) {
        return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star className="w-6 h-6 text-amber-600" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-semibold text-foreground">
              {reviewT("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {reviewT("loading")}
            </p>
          </div>
        </div>
        
        {/* Search and Filter Skeletons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Review Cards Skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                {/* Product Info Skeleton */}
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                
                {/* Rating Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                
                {/* Review Text Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
                
                {/* Date and Actions Skeleton */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (ordersError) {
        return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star className="w-6 h-6 text-amber-600" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-semibold text-foreground">
              {reviewT("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {reviewT("error")}
            </p>
          </div>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {reviewT("errorDescription")}
          </p>
        </Card>
      </div>
    );
  }

  if (showReviewForm && selectedOrderItem) {
    return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Package className="w-6 h-6 text-amber-600" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {reviewT("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {reviewT("description")}
            </p>
          </div>
        </div>

        <ReviewForm
          orderItem={selectedOrderItem.item}
          orderId={Number(selectedOrderItem.orderId)}
          userId={userId}
          onSubmit={(review) => handleSubmitReview(review as Review & { _reviewCreated?: boolean, _itemId?: number })}
          onCancel={handleCancelReview}
          onError={(error) => console.error(error)}
        />
      </div>
    );
  }

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star className="w-6 h-6 text-amber-600" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-semibold text-foreground">
              {reviewT("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {`${localReviews.length} ${reviewT("reviews")} • ${localReviewableItems.length} ${reviewT("productsAwaitingReview")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      {localReviewableItems.length > 0 ? (
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-medium text-foreground mb-2">
                {reviewT("productsAwaitingReview")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reviewT("productsAwaitingReviewDescription")}
              </p>
              <div className="grid gap-3">
                {localReviewableItems.slice(0, 3).map((item) => {
                  return (
                    <div 
                      key={item.identifier} 
                      className={`flex items-center justify-between p-3 bg-background/50 rounded-lg transition-all duration-500 ease-in-out transform ${
                        isRTL ? 'flex-row-reverse' : ''
                      } ${
                        ('_removing' in item && item._removing) 
                          ? 'opacity-0 scale-95 translate-y-2' 
                          : 'opacity-100 scale-100 translate-y-0'
                      }`}
                    >
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ImageWithFallback
                          src={getItemImage(item)}
                          alt={getItemTitle(item)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <h4 className="font-medium text-sm text-foreground">
                            {getItemTitle(item)}
                          </h4>
                          { 'discount_price' in item.orderable && item.orderable.discount_price && (
                            <>
                              <p className="text-xs text-muted-foreground">
                                {`${item.orderable.discount_price} ${reviewT("price")}`}
                              </p>
                              <p className="text-xs text-muted-foreground line-through">
                                {`${item.orderable.price} ${reviewT("price")}`}
                              </p>
                            </>
                          )}
                          { 'price' in item.orderable && item.orderable.price && (
                            <p className="text-xs text-muted-foreground">
                              {`${item.orderable.price} ${reviewT("price")}`}
                            </p>
                          )}
                          {/* Colors Display */}
                          { 'color' in item.orderable && item.orderable.color && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {reviewT("colors")}:
                              </span>
                              <div className="flex gap-1">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                                  style={{ backgroundColor: item.orderable.color }}
                                  title={item.orderable.color}
                                />
                              </div>
                            </div>
                          )}

                          {/* Sizes Display */}
                          { 'variant' in item.orderable && item.orderable.variant && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {reviewT("sizes")}:
                              </span>
                              <div className="flex gap-1">
                                <span
                                    className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-center min-w-[20px]"
                                  >
                                    {item.orderable.variant}
                                  </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartReview(item, item.identifier.toString())}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      >
                        {reviewT("writeReview")}
                      </Button>
                    </div>
                  );
                })}
              </div>
              {localReviewableItems.length > 3 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {`${reviewT("and")} ${localReviewableItems.length - 3} ${reviewT("moreProducts")}`}
                </p>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-muted/30 border border-muted-foreground/20">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="font-medium text-foreground mb-2">
                {reviewT("noProductsAvailableForReview")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {reviewT("noProductsAvailableForReviewDescription")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 🚀 OPTIMIZATION: Use extracted ReviewFilters component */}
      {localReviews.length > 0 && (
        <Card className="p-4">
          <ReviewFilters
            searchQuery={searchQuery}
            filterRating={Number(filterRating)}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onRatingFilterChange={(rating: number) => setFilterRating(rating.toString())}
            onSortByChange={setSortBy}
          />
        </Card>
      )}

      {/* Reviews List */}
      {filteredAndSortedReviews.length === 0 ? (
        <ReviewsEmptyState
          isReviewableItemsEmpty={localReviewableItems.length === 0}
          onGoToProductPage={() => navigateToProducts()}
        />
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReviews.map((review, index) => {
            if (!review) {
              return null;
            }

            const item = deliveredItems.find((item) => item.identifier === review.item.identifier);

            return (
              <div
                key={review.id || index}
                className="animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ReviewItem
                  review={review}
                  item={item as OrderItem}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}