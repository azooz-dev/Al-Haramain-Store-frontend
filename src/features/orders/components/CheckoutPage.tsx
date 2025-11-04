import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useApp } from '@/shared/contexts/AppContext';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { ReviewStep } from './ReviewStep';
import { OrderSummary } from './OrderSummary';
import type { Address } from '@/shared/types';
import { useOrders } from '../hooks/useOrders';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { OrderRequest, PaymentFormData } from '../types';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { useAddress } from '@/shared/hooks/useAddress';

export const CheckoutPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { isRTL } = useApp();
  const { t: orderT } = useFeatureTranslations("orders");
  const { cartItems, cartCalculations, handleSetDiscount, handleClearCart, discountAmount, discountType } = useCart();
  const { createOrder, isCreatingOrder, getCoupon, isLoadingCoupon } = useOrders();
  const { addresses } = useAddress();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'credit_card'>('cash_on_delivery');
  const [couponCode, setCouponCode] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    creditCardName: '',
    creditCardNumber: '',
    creditCardExpirationDate: '',
    creditCardCvv: '',
  });
  const { navigateToHome, navigateToProducts, navigateToCart } = useNavigation();

  const canProceedToStep2 = selectedAddressId !== null;
  const canProceedToStep3 = canProceedToStep2 && (
    paymentMethod === 'cash_on_delivery' ||
    (paymentMethod === 'credit_card' && formData.creditCardNumber && formData.creditCardExpirationDate && formData.creditCardCvv && formData.creditCardName)
  );

  const steps = [
    { number: 1, title: orderT("checkoutPage.steps.shipping"), icon: ArrowRight },
    { number: 2, title: orderT("checkoutPage.steps.payment"), icon: ArrowRight },
    { number: 3, title: orderT("checkoutPage.steps.review"), icon: Check },
  ];

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(1);
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(3);
    }
  }

  const handleApplyCoupon = async () => {
    console.log('handleApplyCoupon', couponCode);
    if (!couponCode.trim()) return;
    try {
      const coupon = await getCoupon(couponCode);
      if (coupon) {
        handleSetDiscount(coupon.data.discount_amount, coupon.data.type as 'fixed' | 'percentage');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const handleRemoveCoupon = () => {
    handleSetDiscount(0, 'fixed');
  }

  const handlePlaceOrder = async () => {
    if (!currentUser?.identifier || !selectedAddressId) return;
    try {
      const orderData: OrderRequest = {
        user_id: currentUser.identifier,
        address_id: selectedAddressId,
        paymentMethod,
        items: cartItems.map(item => ({
          orderable_type: item.orderable,
          orderable_id: item.identifier,
          quantity: item.quantity,
          color_id: item.color?.id || null,
          variant_id: item.variant?.id || null,
        })),
        coupon_code: couponCode.trim() ? couponCode.trim() : undefined,
      };

      const order = await createOrder(orderData);
      if (order) {
        handleClearCart();
        handleSetDiscount(0, 'fixed');
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      return false;
    }
  }

  if (orderComplete) {
        return (
      <div className="min-h-screen  from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-4">
            <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
              </div>
            <h2 className="text-2xl font-bold mb-2">{orderT("checkoutPage.orderCreated")}</h2>
              <p className="text-muted-foreground mb-6">
              {orderT("checkoutPage.orderCreatedDescription")}
              </p>
                <Button 
              onClick={() => navigateToHome()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {orderT("checkoutPage.backToHome")}
                </Button>
            </CardContent>
          </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
      return (
      <div className="min-h-screen  from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-2">{orderT("checkoutPage.cartEmpty")}</h2>
            <p className="text-muted-foreground mb-6">
              {orderT("checkoutPage.cartEmptyDescription")}
            </p>
            <Button 
              onClick={() => navigateToProducts()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {orderT("checkoutPage.continueShopping")}
            </Button>
          </CardContent>
        </Card>
          </div>
    );
  }

    return (
    <div className="min-h-screen  from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigateToCart()}
            className="mb-4"
          >
            {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {orderT("checkoutPage.back")}
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{orderT("checkoutPage.title")}</h1>
          <p className="text-muted-foreground">{orderT("checkoutPage.description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl p-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {steps.map((step, index) => (
                      <React.Fragment key={step.number}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          currentStep >= step.number
                            ? 'bg-amber-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {currentStep > step.number ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            step.number
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-8 md:w-16 h-0.5 mx-2 transition-colors ${
                            currentStep > step.number ? 'bg-amber-600' : 'bg-muted'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-amber-600 ml-2 " })}
                  <span>{orderT("checkoutPage.step")} {currentStep}: {steps[currentStep - 1].title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <ShippingStep
                    user={currentUser}
                    selectedAddressId={selectedAddressId}
                    onAddressSelect={setSelectedAddressId}
                  />
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <PaymentStep
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <ReviewStep
                    cartItems={cartItems}
                    selectedAddress={addresses?.data?.data?.find((addr: Address) => addr.identifier === selectedAddressId) || null}
                    paymentMethod={paymentMethod}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                    {orderT("checkoutPage.previous")}
                  </Button>

                  {currentStep < 3 ? (
                  <Button 
                    onClick={handleNextStep}
                      disabled={
                        (currentStep === 1 && !canProceedToStep2) ||
                        (currentStep === 2 && !canProceedToStep3)
                      }
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {orderT("checkoutPage.next")}
                      {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlaceOrder}
                    disabled={isCreatingOrder}
                      className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isCreatingOrder ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      {isCreatingOrder 
                        ? (orderT("checkoutPage.creatingOrder"))
                        : (orderT("checkoutPage.placeOrder"))
                      }
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={async () => await handleApplyCoupon()}
              isLoadingCoupon={isLoadingCoupon}
              onRemoveCoupon={() => handleRemoveCoupon()}
              subtotal={cartCalculations.subtotal}
              shipping={cartCalculations.shipping}
              tax={cartCalculations.tax}
              total={cartCalculations.total}
              discountAmount={discountAmount}
              discountType={discountType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}