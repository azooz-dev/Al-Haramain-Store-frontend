import React from 'react';
import { Card, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import type { Order } from '@/features/orders/types';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { getStatusIcon, getStatusColor, formatDate } from './orderDetailsUtils';

interface OrderHeaderProps {
  order: Order;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ order }) => {
  const { isRTL } = useApp();
  const { t: featureT } = useFeatureTranslations("user");
  
  const StatusIcon = getStatusIcon(order.status);

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: featureT("orderDetailsModal.status.pending"),
      processing: featureT("orderDetailsModal.status.processing"),
      shipped: featureT("orderDetailsModal.status.shipped"),
      delivered: featureT("orderDetailsModal.status.delivered"),
      cancelled: featureT("orderDetailsModal.status.cancelled"),
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl mb-2">
              {featureT("orderDetailsModal.orderNumber")}: {order.orderNumber}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getStatusColor(order.status)} flex items-center gap-1`}
              >
                <StatusIcon className="h-4 w-4" />
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>
          <div className="text-right sm:text-left">
            <div className="text-sm text-muted-foreground mb-1">
              {featureT("orderDetailsModal.orderDate")}
            </div>
            <div className="font-medium">{formatDate(order.createdDate, isRTL)}</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

