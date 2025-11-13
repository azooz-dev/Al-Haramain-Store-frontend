import React, { useEffect, useRef } from 'react';
import { useElements, CardElement } from '@stripe/react-stripe-js';
import { Label } from '@/shared/components/ui/label'; 
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { StripeCardElement } from '@stripe/stripe-js';

interface StripePaymentElementProps {
  onCardElementReady?: (cardElement: StripeCardElement) => void;
}

export const StripePaymentElement: React.FC<StripePaymentElementProps> = ({
  onCardElementReady,
}) => {
  const { t: paymentT } = useFeatureTranslations('payments');
  const elements = useElements();
  const cardElementRef = useRef<StripeCardElement | null>(null);

  useEffect(() => {
    if (elements && !cardElementRef.current) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElementRef.current = cardElement;
        onCardElementReady?.(cardElement);  
      }      
    }
  }, [elements, onCardElementReady]);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: false,
  };

    return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="stripe-card">
          {paymentT("cardInformation.cardNumber")}
        </Label>
        <div
          id="stripe-card"
          className="p-3 border rounded-md mt-2"
          dir="ltr"
        >
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {paymentT("cardInformation.securityNote")}
        </p>
      </div>
    </div>
  );
}