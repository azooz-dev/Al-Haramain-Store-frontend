import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Separator } from '@shared/components/ui/separator';
import { CreditCard } from 'lucide-react';
import type { Order } from '@/features/orders/types';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { formatPrice } from './orderDetailsUtils';

interface OrderSummaryCardProps {
  order: Order;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("user");

  const getPaymentMethodText = (method: string) => {
    const methodMap = {
      credit_card: featureT("orderDetailsModal.paymentMethod.creditCard"),
      cash_on_delivery: featureT("orderDetailsModal.paymentMethod.cashOnDelivery"),
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  return (
    <Card className={`p-4 ${isRTL ? 'border-r-4 border-r-green-500' : 'border-l-4 border-l-green-500'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-green-100 rounded-full">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          {featureT("orderDetailsModal.orderSummary")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <CreditCard className="h-4 w-4 text-primary dark:text-white" />
              </div>
              <span className="font-medium text-gray-700 dark:text-white">
                {featureT("orderDetailsModal.paymentMethod.label")}
              </span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
              {getPaymentMethodText(order.paymentMethod)}
            </Badge>
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium dark:text-white">
                {featureT("orderDetailsModal.subtotal")}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPrice(order.totalAmount, isRTL)}
              </span>
            </div>

            {order.coupon && (
              <div className="flex justify-between items-center py-2 text-green-600 dark:text-white">
                <div className="flex items-center gap-2">
                  <span className="font-medium dark:text-white">
                    {featureT("orderDetailsModal.couponDiscount")}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {order.coupon.code}
                  </Badge>
                </div>
                <span className="font-semibold dark:text-white">
                  -{formatPrice(order.coupon.discount_amount, isRTL)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-4">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {featureT("orderDetailsModal.totalAmount")}
              </span>
              <span className="text-2xl font-bold text-primary dark:text-white">
                {formatPrice(order.totalAmount, isRTL)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

