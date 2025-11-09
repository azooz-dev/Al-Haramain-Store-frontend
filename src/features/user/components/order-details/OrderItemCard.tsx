import React from 'react';
import { ImageWithFallback } from '@shared/components/common/ImageWithFallback';
import type { OrderItem } from '@/features/orders/types';
import { APP_CONFIG } from '@/shared/config/config';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { formatPrice } from './orderDetailsUtils';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, index }) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("user");

  const orderable = item.orderable;
  const isOffer = item.orderable_type === 'App\\Models\\Offer\\Offer';

  const getImageUrl = () => {
    if (isOffer && 'picture' in orderable) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${orderable.picture}`;
    }
    if ('images' in orderable && orderable.images?.[0]?.image_url) {
      return `${APP_CONFIG.apiBaseUrl}/storage/${orderable.images[0].image_url}`;
    }
    return '';
  };

  const getTitle = () => {
    if (isOffer && 'ar' in orderable && 'en' in orderable) {
      return isRTL ? orderable.ar.title : orderable.en.title;
    }
    return isRTL ? orderable.ar.title : orderable.en.title;
  };

  return (
    <div
      key={index}
      className={`border rounded-xl p-4 bg-gradient-to-r ${
        isRTL ? 'from-slate-50 to-white' : 'from-white to-slate-50'
      } shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start`}>
        {/* Product Image */}
        <div className={`w-20 h-20 flex-shrink-0 relative group ${isRTL ? 'order-2' : 'order-1'}`}>
          <ImageWithFallback
            src={getImageUrl()}
            alt={getTitle()}
            className="w-full h-full object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
          />
          {isOffer && (
            <div
              className={`absolute -top-1 ${
                isRTL ? '-left-1' : '-right-1'
              } bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}
            >
              {featureT("orderDetailsModal.offer")}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className={`flex-1 min-w-0 ${isRTL ? 'order-1' : 'order-2'}`}>
          <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4`}>
            {/* Product Info Section */}
            <div className={`flex-1 space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  {getTitle()}
                </h3>
              </div>

              <div className={`space-y-2 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                {/* Quantity */}
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? 'flex-row justify-end' : 'flex-row-reverse justify-start'
                  }`}
                >
                  <span className="font-semibold text-gray-700">
                    {featureT("orderDetailsModal.quantity")}:
                  </span>
                  <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                    {item.quantity}
                  </span>
                </div>

                {/* Variant/Size */}
                {'variant' in orderable && orderable.variant && (
                  <div
                    className={`flex items-center gap-2 ${
                      isRTL ? 'flex-row justify-end' : 'flex-row-reverse justify-start'
                    }`}
                  >
                    <span className="font-semibold text-gray-700">
                      {featureT("orderDetailsModal.size")}:
                    </span>
                    <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                      {orderable.variant}
                    </span>
                  </div>
                )}

                {/* Color */}
                {'color' in orderable && orderable.color && (
                  <div
                    className={`flex items-center gap-2 ${
                      isRTL ? 'flex-row justify-end' : 'flex-row-reverse justify-start'
                    }`}
                  >
                    <span className="font-semibold text-gray-700">
                      {featureT("orderDetailsModal.color")}:
                    </span>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-300"
                        style={{ backgroundColor: orderable.color }}
                        title={orderable.color}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className={`${isRTL ? 'text-left pl-2' : 'text-right pr-2'} space-y-2 min-w-[140px]`}>
              <div className="text-2xl font-bold text-primary">
                {formatPrice(item.total_price.toString(), isRTL)}
              </div>

              {isOffer && 'offerPrice' in orderable && (
                <div className="text-sm text-green-600 font-medium">
                  {featureT("orderDetailsModal.offerPrice")}: {formatPrice(orderable.offerPrice || '0', isRTL)}
                </div>
              )}

              {isOffer && 'productsTotalPrice' in orderable && orderable.productsTotalPrice && (
                <div className="text-sm text-gray-500 line-through">
                  {featureT("orderDetailsModal.originalPrice")}: {formatPrice(orderable.productsTotalPrice, isRTL)}
                </div>
              )}

              {!isOffer &&
                'price' in orderable &&
                'discount_price' in orderable &&
                orderable.price &&
                orderable.discount_price &&
                orderable.discount_price > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(orderable.price, isRTL)}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

