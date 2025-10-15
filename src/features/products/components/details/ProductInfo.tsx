import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ProductInfoProps {
  name: string;
  rating: number;
  reviews: number;
  price: number;
  amount_discount_price?: number;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  rating,
  reviews,
  price,
  amount_discount_price,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

    return (
    <div className="space-y-3">
      {/* Clean Product Title */}
      <h3 className={`text-base font-medium leading-snug text-gray-900 dark:text-gray-100 ${
        isRTL ? 'text-right' : 'text-left'
      } line-clamp-2`}>
        {name}
      </h3>

        {/* Clean Rating Display */}
        {reviews > 0 && (
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
            {`${reviews} ${productT("info.reviews")}`}
          </span>
        </div>
      )}

      {/* Clean Price Display */}
      <div className="flex items-center gap-2">
          {amount_discount_price && amount_discount_price !== 0 ? (
            <>
              <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                ${amount_discount_price}
              </span>
              <span className="text-sm text-gray-500 line-through">
              ${price}
            </span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-0">
              {productT("info.saveAmount")}{(amount_discount_price - price).toFixed(2)}
            </Badge>
            </>
        ) : (
          <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            ${price}
          </span>
        )}
      </div>
    </div>
  );
}