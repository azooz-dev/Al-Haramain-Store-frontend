import React, { useEffect, useRef } from 'react';
import { useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Label } from '@/shared/components/ui/label'; 
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { Input } from '@/shared/components/ui/input';
import { useApp } from '@/shared/contexts/AppContext';

interface StripePaymentElementProps {
  onCardElementReady?: (cardElement: {
    number: StripeCardNumberElement;
    expiry: StripeCardExpiryElement;
    cvc: StripeCardCvcElement;
  }) => void;
  cardholderName?: string;
  onCardholderNameChange?: (name: string) => void;
}

export const StripePaymentElement: React.FC<StripePaymentElementProps> = ({
  onCardElementReady,
  cardholderName,
  onCardholderNameChange,
}) => {
  const { t: paymentT } = useFeatureTranslations('payments');
  const { isRTL } = useApp();
  const elements = useElements();
  const cardNumberRef = useRef<StripeCardNumberElement>(null);
  const cardExpiryRef = useRef<StripeCardExpiryElement>(null);
  const cardCvcRef = useRef<StripeCardCvcElement>(null);

  useEffect(() => {
    if (elements) {
      const cardNumber = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);

      if (cardNumber && cardExpiry && cardCvc) {
        cardNumberRef.current = cardNumber;
        cardExpiryRef.current = cardExpiry;
        cardCvcRef.current = cardCvc;
      }

      // Notify parent that card elements are ready
      // We don't need to pass the elements since they'll be retrieved from Elements instance when confirming payment
      if (onCardElementReady) {
        onCardElementReady({
          number: cardNumber as StripeCardNumberElement,
          expiry: cardExpiry as StripeCardExpiryElement,
          cvc: cardCvc as StripeCardCvcElement,
        });
      }
    }
  }, [elements, onCardElementReady]);

  const elementStyle = {
    base: {
      fontSize: '14px',
      color: 'hsl(var(--foreground))',
      fontFamily: 'inherit',
      padding: '8px 12px',
      '::placeholder': {
        color: 'hsl(var(--muted-foreground))',
      },
    },
    invalid: {
      color: 'hsl(var(--destructive))',
      iconColor: 'hsl(var(--destructive))',
    },
  };

  const elementWrapperClass = "h-9 bg-[#f3f4f6] p-2 w-full rounded-md border border-input bg-input-background";

  return (
    <div className="space-y-4">
      {/* Cardholder Name - This CAN use your Input component */}
      <div>
        <Label htmlFor="cardholder-name" className='mb-2 mx-2'>
          {paymentT("cardInformation.cardholderName")}
        </Label>
        <Input
          id="cardholder-name"
          type="text"
          value={cardholderName}
          onChange={(e) => onCardholderNameChange?.(e.target.value)}
          placeholder={paymentT("cardInformation.cardholderNamePlaceholder")}
          className={isRTL ? 'text-right' : 'text-left'}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Card Number - Must use Stripe Element */}
      <div>
        <Label htmlFor="card-number" className='mb-2 mx-2'>
          {paymentT("cardInformation.cardNumber")}
        </Label>
        <div 
          id="card-number"
          className={elementWrapperClass}
          dir="ltr"
        >
          <CardNumberElement 
            options={{
              style: elementStyle,
              placeholder: paymentT("cardInformation.cardNumberPlaceholder") || "1234 5678 9012 3456",
            }}
          />
        </div>
      </div>

      {/* Expiry and CVV in a grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date - Must use Stripe Element */}
        <div>
          <Label htmlFor="card-expiry" className='mb-2 mx-2'>
            {paymentT("cardInformation.expiryDate")}
          </Label>
          <div 
            id="card-expiry"
            className={elementWrapperClass}
            dir="ltr"
          >
            <CardExpiryElement 
              options={{
                style: elementStyle,
                placeholder: paymentT("cardInformation.expiryDatePlaceholder") || "MM/YY",
              }}
            />
          </div>
        </div>

        {/* CVV - Must use Stripe Element */}
        <div>
          <Label htmlFor="card-cvc" className='mb-2 mx-2'>
            {paymentT("cardInformation.cvv")}
          </Label>
          <div 
            id="card-cvc"
            className={elementWrapperClass}
            dir="ltr"
          >
            <CardCvcElement 
              options={{
                style: elementStyle,
                placeholder: paymentT("cardInformation.cvvPlaceholder") || "123",
              }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {paymentT("cardInformation.securityNote")}
      </p>
    </div>
  );
}