import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@shared/components/ui/dialog';
import { Package } from 'lucide-react';
import type { Order } from '@/features/orders/types';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { OrderHeader, OrderItemsList, ShippingAddressCard, CustomerInformationCard, OrderSummaryCard } from './order-details/index';

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose 
}) => {
  const { t: featureT } = useFeatureTranslations("orders");

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            {featureT("orderDetailsModal.title")}
          </DialogTitle>
          <DialogDescription>
            {featureT("orderDetailsModal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <OrderHeader order={order} />

          {/* Order Items */}
          <OrderItemsList items={order.items} />

          {/* Shipping Address */}
          <ShippingAddressCard address={order.address} />

          {/* Customer Information */}
          <CustomerInformationCard customer={order.customer} />

          {/* Order Summary */}
          <OrderSummaryCard order={order} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
