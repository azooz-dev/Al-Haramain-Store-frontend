import React from 'react';
import { ShoppingCart, Tag, Percent } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { CartItem } from '@/features/cart/types';
import { ProcessedError } from '@/shared/types';

interface OrderSummaryProps {
  cartItems: CartItem[];
  couponCode: string;
  onCouponCodeChange: (couponCode: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isLoadingCoupon: boolean;
  discountAmount: number;
  discountType: "fixed" | "percentage";
  couponError: ProcessedError | undefined;
  couponAppliedMessage: string | null;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  subtotal,
  shipping,
  tax,
  total,
  isLoadingCoupon,
  discountAmount,
  discountType,
  couponError,
  couponAppliedMessage,
}) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("orders");

    return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl sticky top-8 p-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-amber-600" />
            <span>{featureT("orderSummary.title")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={`${item.identifier}-${item.color?.id}-${item.variant?.id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.en.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{isRTL ? item.ar.title : item.en.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {featureT("orderSummary.quantity")}: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${((item.amount_discount_price && item.amount_discount_price > 0 ? item.amount_discount_price : item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Coupon Section */}
          <div className="space-y-3">
            <div className="flex gap-2 items-center justify-between">
              <Input
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                placeholder={featureT("orderSummary.couponCodePlaceholder")}
                className="flex-1"
                />
                {discountAmount > 0 && (
                  <Button
                    onClick={onRemoveCoupon}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white border-0 hover:text-white mt-2"
                  >
                    {featureT("orderSummary.removeCoupon")}
                  </Button>
                )}
                {discountAmount === 0 && (
                  <Button
                    onClick={onApplyCoupon}
                    variant="outline"
                    size="sm"
                    disabled={!couponCode.trim()}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white border-0 hover:text-white mt-2"
                  >
                    <Tag className="h-3 w-3" />
                    {isLoadingCoupon ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      featureT("orderSummary.applyCoupon")
                    )}
                  </Button>
                )}
            </div>
            
            {/* Coupon Error Message */}
            {couponError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {couponError.data.message}
                </p>
              </div>
            )}

            {/* Coupon Success Message */}
            {couponAppliedMessage && !couponError && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-600 dark:text-green-400 text-sm text-center">
                  {couponAppliedMessage}
                </p>
              </div>
            )}
            
            {discountAmount > 0 && (
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">
                    {discountType === "fixed" ? `${featureT("orderSummary.discount")}: $${discountAmount}` : `${featureT("orderSummary.discount")}: ${discountAmount}%`}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    -${discountAmount ? discountAmount : 0}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{featureT("orderSummary.subtotal")}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{featureT("orderSummary.shipping")}</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{featureT("orderSummary.tax")}</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{featureT("orderSummary.discount")}</span>
                <span>-${discountAmount ? discountAmount : 0}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>{featureT("orderSummary.total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}