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
import { Address, AddressFormData, UpdateAddressRequest, DeleteAddressRequest, AddressResponse, DeleteAddressResponse } from '@/shared/types';
import { useOrders } from '../hooks/useOrders';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { OrderRequest } from '../types';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { useAddress } from '@/shared/hooks/useAddress';
import { useStripePayment } from '@/features/payments/hooks/useStripePayment';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { APP_CONFIG } from '@/shared/config/config';
import { useToast } from '@/shared/hooks/useToast';
import { ProcessedError } from '@/shared/types';
import { OrderResponse } from '../types';
import { CouponResponse } from '../types';
import { CreatePaymentIntentRequest } from '@/features/payments/types';
import { BillingDetails } from '@stripe/stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { StripeElements } from '@stripe/stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';

// Initialize Stripe promise (shared instance - same one used in Elements provider)
const stripePromise = loadStripe(APP_CONFIG.stripePublishKey);

// Main checkout component (uses Stripe hooks - must be inside Elements provider)
const CheckoutContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { isRTL } = useApp();
  const { t: orderT } = useFeatureTranslations("orders");
  const { cartItems, cartCalculations, handleSetDiscount, handleClearCart, discountAmount, discountType } = useCart();
  const { createOrder, isCreatingOrder, createOrderError, getCoupon, isLoadingCoupon, couponError } = useOrders() as {
    createOrder: (orderData: OrderRequest) => Promise<OrderResponse>;
    isCreatingOrder: boolean;
    createOrderError: ProcessedError | undefined;
    getCoupon: (code: string) => Promise<CouponResponse>;
    isLoadingCoupon: boolean;
    couponError: ProcessedError | undefined;
  };
  const { toast } = useToast();
  const {
    addresses,
    isLoadingAddresses,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    createAddressError,
    updateAddressError,
    deleteAddressError,
  } = useAddress() as {
    addresses: Address[];
    isLoadingAddresses: boolean;
    isCreatingAddress: boolean;
    isUpdatingAddress: boolean;
    isDeletingAddress: boolean;
    createAddress: (addressData: AddressFormData) => Promise<AddressResponse>;
    updateAddress: (addressData: UpdateAddressRequest) => Promise<AddressResponse>;
    deleteAddress: (addressData: DeleteAddressRequest) => Promise<DeleteAddressResponse>;
    createAddressError: ProcessedError | undefined;
    updateAddressError: ProcessedError | undefined;
    deleteAddressError: ProcessedError | undefined;
  };
  const { navigateToHome, navigateToProducts, navigateToCart } = useNavigation();
  
  // Get Stripe and Elements instances from Elements provider (now inside Elements context)
  const stripe = useStripe();
  const elements = useElements();
  
  // Stripe payment hook
  const { 
    createPaymentIntent,
    confirmPayment,
    isLoading: isStripeLoading,
    createPaymentIntentError,
  } = useStripePayment() as {
    createPaymentIntent: (data: CreatePaymentIntentRequest) => Promise<string | null>;
    confirmPayment: (clientSecret: string, billingDetails: BillingDetails, stripeInstance: Stripe | null, elementsInstance: StripeElements | null) => Promise<PaymentIntent | null>;
    isLoading: boolean;
    createPaymentIntentError: ProcessedError | undefined;
  };
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'credit_card'>('cash_on_delivery');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardElementsReady, setCardElementsReady] = useState(false);
  const [couponAppliedMessage, setCouponAppliedMessage] = useState<string | null>(null);


  const canProceedToStep2 = selectedAddressId !== null;
  const canProceedToStep3 = canProceedToStep2 && (
    paymentMethod === 'cash_on_delivery' ||
    (paymentMethod === 'credit_card' && cardElementsReady)
  );

  const steps = [
    { number: 1, title: orderT("checkoutPage.steps.shipping"), icon: ArrowRight },
    { number: 2, title: orderT("checkoutPage.steps.payment"), icon: ArrowRight },
    { number: 3, title: orderT("checkoutPage.steps.review"), icon: Check },
  ];

  const handleCardElementsReady = () => {
    setCardElementsReady(true);
  }


  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(3);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || appliedCouponCode === couponCode) return;
    const coupon = await getCoupon(couponCode);
    if (coupon) {
      setAppliedCouponCode(coupon.data.code);
      handleSetDiscount(coupon.data.discount_amount, coupon.data.type as 'fixed' | 'percentage');
      setCouponAppliedMessage(orderT("checkoutPage.couponApplied"));
    }
  };

  const handleRemoveCoupon = () => {
    handleSetDiscount(0, 'fixed');
    setAppliedCouponCode(null);
  };

  const handlePlaceOrder = async () => {
    if (!currentUser?.identifier || !selectedAddressId) {
      toast.error(orderT("checkoutPage.pleaseCompleteAllRequiredFields"));
      return;
    }

    try {
      const orderData: OrderRequest = {
        userId: currentUser.identifier,
        addressId: selectedAddressId,
        paymentMethod,
        items: cartItems.map(item => ({
          orderable_type: item.orderable,
          orderable_id: item.identifier,
          quantity: item.quantity,
          color_id: item.color?.id ?? undefined,
          variant_id: item.variant?.id ?? undefined,
        })),
        couponCode: appliedCouponCode?.trim() || undefined,
      };

      // CASH ON DELIVERY FLOW
      if (paymentMethod === 'cash_on_delivery') {
        const response = await createOrder(orderData);
        if (response.status === "success") {
          handleClearCart();
          handleSetDiscount(0, 'fixed');
          setOrderComplete(true);
          toast.success(orderT("checkoutPage.orderCreated"))
        } else {
          toast.error(createOrderError?.data.message as string);
        }
      }

      // STRIPE CREDIT CARD FLOW
      if (paymentMethod === 'credit_card') {
        if (!stripe || !elements) {
            console.error(orderT("checkoutPage.stripeNotInitialized")); // Temp message to added the notification later
          return;
        }

        // Step 1: Create Payment Intent
        const clientSecret = await createPaymentIntent({
          amount: cartCalculations.total,
          currency: 'usd',
          ...orderData,
          totalAmount: cartCalculations.total,
        });

        if (!clientSecret) {
          toast.error(createPaymentIntentError?.data.message as string);
          return;
        }

        // Step 2: Get selected address for billing details
        const selectedAddress = addresses?.find((addr: Address) => addr.identifier === selectedAddressId);

        if (!selectedAddress) {
          console.error('Selected address not found'); // Temp message to added the notification later
          return;
        }

        // Step 3: Confirm payment with Stripe (business logic handled in hook)
        const paymentIntent = await confirmPayment(
          clientSecret,
          {
            name: cardholderName || (currentUser.firstName && currentUser.lastName 
              ? `${currentUser.firstName} ${currentUser.lastName}` 
              : currentUser.email) || "",
            address: {
              line1: selectedAddress.street || "",
              line2: null,
              city: selectedAddress.city || "",
              state: selectedAddress.state || "",
              postal_code: selectedAddress.postalCode || "",
              country: selectedAddress.country,
            }
          },
          stripe,
          elements
        );

        if (!paymentIntent) {
          console.error('Payment failed'); // Temp message to added the notification later
          return;
        }

        // Step 4: Create order with payment_intent_id
        const response = await createOrder({
          ...orderData,
          paymentIntentId: paymentIntent.id,
        });

        if (response.status === "success") {
          handleClearCart();
          handleSetDiscount(0, 'fixed');
          setOrderComplete(true);
          toast.success(orderT("checkoutPage.orderCreated"))
        } else {
          toast.error(createOrderError?.data.message as string);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error); // Temp message to added the notification later
    }
  };

  const isLoading = isCreatingOrder || isStripeLoading;

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
        <Card className="w-full max-w-md text-center p-4">
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
                    addresses={addresses}
                    isLoadingAddresses={isLoadingAddresses}
                    isCreatingAddress={isCreatingAddress}
                    isUpdatingAddress={isUpdatingAddress}
                    isDeletingAddress={isDeletingAddress}
                    createAddress={createAddress}
                    updateAddress={updateAddress}
                    deleteAddress={deleteAddress}
                    createAddressError={createAddressError}
                    updateAddressError={updateAddressError}
                    deleteAddressError={deleteAddressError}
                  />
                )}

                {/* Step 2: Payment Information */}
                {/* Keep PaymentStep mounted on step 3 for credit_card to keep Stripe Elements accessible */}
                {/* Stripe Elements must remain in DOM for confirmPayment to retrieve them */}
                {(currentStep === 2 || (currentStep === 3 && paymentMethod === 'credit_card')) && (
                  <div className={currentStep !== 2 ? 'sr-only' : ''}>
                    <PaymentStep
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={setPaymentMethod}
                      onCardElementsReady={handleCardElementsReady}
                      cardholderName={cardholderName}
                      onCardholderNameChange={setCardholderName}
                    />
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <ReviewStep
                    cartItems={cartItems}
                    selectedAddress={addresses?.find((addr: Address) => addr.identifier === selectedAddressId) || null}
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
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      {isLoading
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
              couponError={couponError}
              couponAppliedMessage={couponAppliedMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component wrapped with Elements provider (thin wrapper - only provides Stripe context)
export const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
};