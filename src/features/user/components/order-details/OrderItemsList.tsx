import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { OrderItem } from '@/features/orders/types';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { OrderItemCard } from './OrderItemCard';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  const { t: featureT } = useFeatureTranslations("user");

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {featureT("orderDetailsModal.orderItems")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <OrderItemCard key={index} item={item} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

