import React from 'react';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { StripePaymentElement } from '@/features/payments/components/StripePaymentElement';
import { StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

interface PaymentStepProps {
  paymentMethod: 'cash_on_delivery' | 'credit_card';
  onPaymentMethodChange: (paymentMethod: 'cash_on_delivery' | 'credit_card') => void;
  onCardElementsReady?: (cardElements: {
    number: StripeCardNumberElement;
    expiry: StripeCardExpiryElement;
    cvc: StripeCardCvcElement;
  }) => void;
  cardholderName?: string;
  onCardholderNameChange?: (name: string) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  onCardElementsReady,
  cardholderName = '',
  onCardholderNameChange,
}) => {
  const { t: featureT } = useFeatureTranslations("orders");

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-amber-600" />
          {featureT("paymentStep.title")}
        </h4>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => onPaymentMethodChange(value as 'cash_on_delivery' | 'credit_card')}
          className="space-y-3"
        >
          {/* Cash on Delivery Option */}
          <div className="relative">
            <div
              onClick={() => onPaymentMethodChange('cash_on_delivery')}
              className={`block cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{featureT("paymentStep.paymentMethod.cashOnDelivery")}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {featureT("paymentStep.paymentMethod.cashOnDeliveryDescription")}
                  </p>
                </div>
                {paymentMethod === 'cash_on_delivery' && (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
            </div>
          </div>

          {/* Credit Card Option */}
          <div className="relative">
            <div
              onClick={() => onPaymentMethodChange('credit_card')}
              className={`block cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                paymentMethod === 'credit_card'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{featureT("paymentStep.paymentMethod.creditCard")}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {featureT("paymentStep.paymentMethod.creditCardDescription")}
                  </p>
                </div>
                {paymentMethod === 'credit_card' && (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Stripe Payment Form - Only show for credit card */}
      {paymentMethod === 'credit_card' && (
        <div className="space-y-4">
          <h5 className="font-medium">{featureT("paymentStep.creditCardInformation.title")}</h5>
          <StripePaymentElement 
            onCardElementReady={onCardElementsReady}
            cardholderName={cardholderName}
            onCardholderNameChange={onCardholderNameChange}
          />
        </div>
      )}
    </div>
  );
};