import React from 'react';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { useApp } from '@/shared/contexts/AppContext';
import { PaymentFormData } from '@/features/orders/types';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface PaymentStepProps {
  paymentMethod: 'cash_on_delivery' | 'credit_card';
  onPaymentMethodChange: (paymentMethod: 'cash_on_delivery' | 'credit_card') => void;
  formData: PaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  formData,
  setFormData,
}) => {
  const { t: featureT } = useFeatureTranslations("orders");
  const { isRTL } = useApp();

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
                {/* Payment method icon */}
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{featureT("paymentStep.paymentMethod.creditCard")}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {featureT("paymentStep.paymentMethod.creditCardDescription")}
                  </p>
                </div>
                
                {/* Selection indicator */}
                {paymentMethod === 'credit_card' && (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
            </div>
          </div>

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
                {/* Payment method icon */}
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{featureT("paymentStep.paymentMethod.cashOnDelivery")}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {featureT("paymentStep.paymentMethod.cashOnDeliveryDescription")}
                  </p>
                </div>
                
                {/* Selection indicator */}
                {paymentMethod === 'cash_on_delivery' && (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'credit_card' && (
        <div className="space-y-4">
          <h5 className="font-medium">{featureT("paymentStep.creditCardInformation.title")}</h5>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName">{featureT("paymentStep.creditCardInformation.cardholderName")}</Label>
              <Input
                id="cardName"
                value={formData.creditCardName}
                onChange={(e) => setFormData({ ...formData, creditCardName: e.target.value })}
                placeholder={featureT("paymentStep.creditCardInformation.cardholderNamePlaceholder")}
                className={isRTL ? 'text-right' : 'text-left'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">{featureT("paymentStep.creditCardInformation.cardNumber")}</Label>
              <Input
                id="cardNumber"
                value={formData.creditCardNumber}
                onChange={(e) => setFormData({ ...formData, creditCardNumber: e.target.value })}
                placeholder={featureT("paymentStep.creditCardInformation.cardNumberPlaceholder")}
                maxLength={19}
                className={isRTL ? 'text-right' : 'text-left'}
                dir="ltr"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">{featureT("paymentStep.creditCardInformation.expiryDate")}</Label>
                <Input
                  id="expiryDate"
                  value={formData.creditCardExpirationDate}
                  onChange={(e) => setFormData({ ...formData, creditCardExpirationDate: e.target.value })}
                  placeholder={featureT("paymentStep.creditCardInformation.expiryDatePlaceholder")}
                  maxLength={5}
                  className={isRTL ? 'text-right' : 'text-left'}
                  dir="ltr"
                />
              </div>
              
              <div>
                <Label htmlFor="cvv">{featureT("paymentStep.creditCardInformation.cvv")}</Label>
                <Input
                  id="cvv"
                  value={formData.creditCardCvv}
                  onChange={(e) => setFormData({ ...formData, creditCardCvv: e.target.value })}
                  placeholder={featureT("paymentStep.creditCardInformation.cvvPlaceholder")}
                  maxLength={4}
                  className={isRTL ? 'text-right' : 'text-left'}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}