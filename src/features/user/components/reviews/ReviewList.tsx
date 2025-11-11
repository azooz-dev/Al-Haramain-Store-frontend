import React, { useState, useMemo } from 'react';
import { Star, Package, ShoppingBag } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { ReviewForm } from './ReviewForm';
import { ReviewsEmptyState } from './ReviewsEmptyState';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useUsers } from '../../hooks/useUsers';
import { Review } from '@/features/products/types';
import { OrderItem, Order } from '@/features/orders/types';
import { APP_CONFIG } from '@/shared/config/config';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { Badge } from '@/shared/components/ui/badge';

interface ReviewListProps {
  userId: number;
}

interface ReviewableItemGroup {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ userId }) => {
  const { isRTL } = useApp();
  const { t: reviewT } = useFeatureTranslations("user");
  const { navigateToProducts } = useNavigation();
  const { userOrdersData, isLoadingUserOrders: isOrdersLoading, userOrdersError: ordersError } = useUsers();
  const orders = userOrdersData?.data.data;

  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<{ item: OrderItem, orderId: number } | null>(null);
  const [reviewedItemIds, setReviewedItemIds] = useState<Set<number>>(new Set());

  // Group reviewable items by order
  const reviewableItemsByOrder: ReviewableItemGroup[] = useMemo(() => {
    if (!orders) return [];

    return orders
      .filter((order: Order) => order.status === "delivered")
      .map((order: Order) => {
        const unreviewedItems = order.items.filter((item: OrderItem) => {
          // Check if item is already reviewed (from backend or locally)
          const isReviewed = item.is_reviewed === true || reviewedItemIds.has(item.identifier);
          return !isReviewed;
        });

        if (unreviewedItems.length === 0) return null;

        return {
          orderId: order.identifier,
          orderNumber: order.orderNumber,
          orderDate: order.createdDate,
          items: unreviewedItems,
        };
      })
      .filter((group): group is ReviewableItemGroup => group !== null)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, reviewedItemIds]);

  // Calculate total reviewable items count
  const totalReviewableItems = useMemo(() => {
    return reviewableItemsByOrder.reduce((total, group) => total + group.items.length, 0);
  }, [reviewableItemsByOrder]);

  const handleStartReview = (item: OrderItem, orderId: number) => {
    setSelectedOrderItem({ item, orderId });
    setShowReviewForm(true);
  };

  const handleSuccessfulReviewCreation = (review: Review & { _reviewCreated?: boolean, _itemId?: number }) => {
    if (review._reviewCreated && review._itemId) {
      // Mark item as reviewed locally
      setReviewedItemIds((prev) => new Set([...prev, review._itemId!]));
    }
  };

  const handleSubmitReview = (review: Review & { _reviewCreated?: boolean, _itemId?: number }) => {
    if (review._reviewCreated && review._itemId) {
      handleSuccessfulReviewCreation(review);
      setShowReviewForm(false);
      setSelectedOrderItem(null);
    } else {
      setShowReviewForm(false);
      setSelectedOrderItem(null);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setSelectedOrderItem(null);
  };

  const getItemImage = (item: OrderItem) => {
    if ('images' in item.orderable && item.orderable.images?.[0]?.image_url) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.images[0].image_url}`;
    } else if ('picture' in item.orderable && item.orderable.picture) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${item.orderable.picture}`;
    }
    return '';
  };

  const getItemTitle = (item: OrderItem) => {
    return isRTL ? item.orderable.ar.title : item.orderable.en.title;
  };

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
        <Card className="p-12 text-center p-4">
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
        
        {/* Loading Skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-9 w-24" />
                    </div>
                  ))}
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
        <Card className="p-12 text-center p-4">
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
          orderId={selectedOrderItem.orderId}
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
              {totalReviewableItems > 0 
                ? `${totalReviewableItems} ${reviewT("productsAwaitingReview")}`
                : reviewT("noProductsAvailableForReviewDescription")
              }
            </p>
          </div>
        </div>
      </div>

      {/* Reviewable Items Grouped by Order */}
      {reviewableItemsByOrder.length > 0 ? (
        <div className="space-y-6">
          {reviewableItemsByOrder.map((orderGroup) => (
            <Card 
              key={orderGroup.orderId} 
              className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800"
            >
              {/* Order Header */}
              <div className={`flex items-center justify-between mb-4 pb-4 border-b border-amber-200 dark:border-amber-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="font-semibold text-foreground">
                      {isRTL ? reviewT("order") : reviewT("order")} #{orderGroup.orderNumber}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(orderGroup.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  {orderGroup.items.length} {orderGroup.items.length === 1 ? reviewT("item") : reviewT("items")}
                </Badge>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {orderGroup.items.map((item) => (
                  <div 
                    key={item.identifier} 
                    className={`flex items-center justify-between p-4 bg-background/50 rounded-lg transition-all duration-300 hover:bg-background/80 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ImageWithFallback
                        src={getItemImage(item)}
                        alt={getItemTitle(item)}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h4 className="font-medium text-sm text-foreground mb-1">
                          {getItemTitle(item)}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          { 'discount_price' in item.orderable && item.orderable.discount_price && (
                            <>
                              <span className="font-medium text-foreground">
                                ${item.orderable.discount_price}
                              </span>
                              <span className="line-through">
                                ${item.orderable.price}
                              </span>
                            </>
                          )}
                          { 'price' in item.orderable && item.orderable.price && !('discount_price' in item.orderable && item.orderable.discount_price) && (
                            <span className="font-medium text-foreground">
                              ${item.orderable.price}
                            </span>
                          )}
                          { 'color' in item.orderable && item.orderable.color && (
                            <span className="flex items-center gap-1">
                              <span>{reviewT("colors")}:</span>
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: item.orderable.color }}
                                title={item.orderable.color}
                              />
                            </span>
                          )}
                          { 'variant' in item.orderable && item.orderable.variant && (
                            <span className="flex items-center gap-1">
                              <span>{reviewT("sizes")}:</span>
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-center">
                                {item.orderable.variant}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleStartReview(item, orderGroup.orderId)}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex-shrink-0"
                    >
                      {reviewT("writeReview")}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <ReviewsEmptyState
          isReviewableItemsEmpty={true}
          onGoToProductPage={() => navigateToProducts()}
        />
      )}
    </div>
  );
};
