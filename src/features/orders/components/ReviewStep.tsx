import React from 'react';
import { Truck, Package, FileText } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useApp } from '@/shared/contexts/AppContext';
import { APP_CONFIG } from '@/shared/config/config';
import { CartItem } from '@/features/cart/types';
import { Address } from '@/shared/types';

interface ReviewStepProps {
  cartItems: CartItem[];
  selectedAddress: Address;
  paymentMethod: 'cash_on_delivery' | 'credit_card';
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  cartItems,
  selectedAddress,
  paymentMethod,
}) => {
  const { t: featureT } = useFeatureTranslations("orders");
  const { isRTL } = useApp();

    return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          {featureT("reviewStep.title")}
        </h4>
        
        {/* Order Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.identifier}-${item.color?.id}-${item.variant?.id}`} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <ImageWithFallback
                  src={`${APP_CONFIG.apiBaseUrl}/storage/${item.image}`}
                  alt={item.en.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">{ isRTL ? item.ar.title : item.en.title}</h5>
                <p className="text-sm text-muted-foreground">
                  {featureT("reviewStep.quantity")}: {item.quantity}
                </p>
                {item.color?.id && (
                  <p className="text-sm text-muted-foreground">
                    {featureT("reviewStep.color")}: {item.color?.color_code}
                  </p>
                )}
                {item.variant?.id && (
                  <p className="text-sm text-muted-foreground">
                    {featureT("reviewStep.size")}: {item.variant?.size}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">${(( item.amount_discount_price && item.amount_discount_price > 0  ? item.amount_discount_price : item.price) * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} {featureT("reviewStep.each")}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Shipping Details */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h5 className="text-sm mb-2 flex items-center">
            <Truck className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
            {featureT("reviewStep.shippingAddress.title")}
          </h5>
          {selectedAddress ? (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{selectedAddress.street}</p>
              <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</p>
              <p>{selectedAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{featureT("reviewStep.shippingAddress.noAddressSelected")}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="p-4 bg-muted rounded-lg">
          <h5 className="text-sm mb-2 flex items-center">
            <Package className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
            {featureT("reviewStep.paymentMethod.title")}
          </h5>
          <p className="text-sm text-muted-foreground">
            {paymentMethod === 'credit_card' 
              ? featureT("reviewStep.paymentMethod.creditCard")
              : featureT("reviewStep.paymentMethod.cashOnDelivery")
            }
          </p>
        </div>
      </div>
    </div>
  );
}