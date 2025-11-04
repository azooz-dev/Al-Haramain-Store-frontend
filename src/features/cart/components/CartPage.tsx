import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Gift,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ImageWithFallback } from "@/shared/components/common/ImageWithFallback";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "../hooks/useCart";
import { CartColorDisplay } from "./CartColorDisplay";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useApp } from "@/shared/contexts/AppContext";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { FavoritesToggleButton } from "@/features/favorites/components/FavoritesToggleButton";
import { CartItem } from "../types";

export const CartPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: cartT } = useFeatureTranslations("cart");
  const { navigateToProducts, navigateToHome, navigateToCheckout } = useNavigation();
  const { cartItems, cartSummary, handleUpdateQuantity, handleRemoveItem, cartCalculations } = useCart();

  // Helper function to safely convert price to number
  const getPriceAsNumber = (price: number | string | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price) || 0;
    return 0;
  };

  const handleQuantityChange = (identifier: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(identifier);
    } else {
      handleUpdateQuantity(identifier, quantity);
    }
  }


  if (cartItems.length === 0) {
        return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl p-4">
              <CardContent className="p-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl mb-4">{cartT('emptyCart')}</h2>
                <p className="text-muted-foreground mb-8">
                  {cartT('ourProductsDescription')}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigateToProducts()}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {cartT('startShopping')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigateToHome()}
                    className="w-full"
                  >
                    {cartT('backToHome')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 flex items-center">
            <ShoppingBag className="h-8 w-8 mr-3 text-amber-600 ml-2" />
            {cartT('shoppingCart')}
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {isRTL ? (cartItems.length === 1 ? cartT('product') : cartT('products')) + ' ' + cartT('inYourCart') : (cartItems.length === 1 ? cartT('item') : cartT('items')) + ' ' + cartT('inYourCart')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {/* Cart Items List */}
              {cartItems.map((item: CartItem) => (
              <Card key={item.identifier} className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 mx-auto md:mx-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={isRTL ? item.ar.title : item.en.title}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full shadow-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveItem(item.identifier)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      {/* Product Name and Price */}
                      <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                          <h3 className="text-lg">{isRTL ? item.ar.title : item.en.title}</h3>
                          {item.orderable === 'offer' && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                              <Gift className="w-3 h-3 mr-1" />
                              {cartT('offer')}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 mb-2">
                          {item.color?.id && (
                            <CartColorDisplay
                              colorCode={item.color?.color_code || '#000000'}
                            />
                          )}
                          {item.variant?.id && (
                            <p className="text-sm text-muted-foreground">{cartT('display.size')}: {item.variant?.size}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          {item.amount_discount_price > 0 ? (
                            <>
                              <span className="text-lg text-muted-foreground line-through">
                                ${getPriceAsNumber(item.price).toFixed(2)}
                              </span>
                              <span className="text-xl text-primary">
                                ${item.amount_discount_price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl text-primary">
                              ${getPriceAsNumber(item.price).toFixed(2)}
                            </span>
                          )}
                          {item.orderable === 'offer' && item.amount_discount_price > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                              {cartT('save')} ${(getPriceAsNumber(item.price) - getPriceAsNumber(item.amount_discount_price)).toFixed(2)}
                            </span>
                          )}
                      </div>

                      {/* Controls Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {cartT('quantity')}:
                          </span>
                          <div className="flex items-center border border-border rounded-lg bg-background">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.identifier, item.quantity - 1)}
                              className="h-8 w-8 p-0 rounded-none hover:bg-muted"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-4 py-1 text-center min-w-[3rem] text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.identifier, item.quantity + 1)}
                              className="h-8 w-8 p-0 rounded-none hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-center sm:text-right">
                          <div className="text-lg">
                              {cartT('total')}: <span className="text-xl text-primary">
                                {isRTL ?
                                  ((getPriceAsNumber(item.amount_discount_price) || getPriceAsNumber(item.price)) * item.quantity).toFixed(2).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) + "$"
                                  : ((getPriceAsNumber(item.amount_discount_price) || getPriceAsNumber(item.price)) * item.quantity).toFixed(2) + "$"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Actions */}
                      <div className="flex justify-center sm:justify-start gap-2 pt-2">
                        { item.orderable === 'product' && (
                        <FavoritesToggleButton
                          productId={item.identifier}
                          colorId={item.color?.id}
                          variantId={item.variant?.id}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          showText={true}
                          customStyles={{
                            unfavorited: "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          }}
                        />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.identifier)}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {cartT('remove')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>
              ))}
                
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl sticky top-8 p-4">
              <CardHeader>
                <CardTitle>{cartT('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item: CartItem) => (
                    <div key={item.identifier} className="flex items-center space-x-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={isRTL ? item.ar.title : item.en.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mr-2">
                          <h4 className="text-sm truncate">{isRTL ? item.ar.title : item.en.title}</h4>
                          {item.orderable === 'offer' && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs px-1 py-0">
                              <Gift className="w-2 h-2 mr-1" />
                              {cartT('offer')}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mr-2 space-y-1">
                          <p>{cartT('quantity')}: {item.quantity}</p>
                          {item.color?.id && (
                            <div className="flex items-center gap-1">
                              <span className={`text-sm text-muted-foreground ${isRTL ? 'ml-1' : 'mr-1'}`}>{cartT('display.color')}:</span>
                              <CartColorDisplay
                                colorCode={item.color?.color_code || '#000000'}
                              />
                            </div>
                          )}
                          {item.variant?.id && (
                            <p>{cartT('display.size')}: {item.variant?.size}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm">{isRTL ? ((getPriceAsNumber(item.amount_discount_price) || getPriceAsNumber(item.price)) * item.quantity).toFixed(2).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) + "$" : ((getPriceAsNumber(item.amount_discount_price) || getPriceAsNumber(item.price)) * item.quantity).toFixed(2) + "$"}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{cartT('subtotal')} ({cartSummary.totalItems} {cartT('items')})</span>
                    <span>{isRTL ? cartCalculations.subtotal.toFixed(2).replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) + "$" : cartCalculations.subtotal.toFixed(2) + "$"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{ cartT('shipping') }</span>
                    <span>{cartCalculations.shipping === 0 ? cartT('free') : `$${cartCalculations.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{cartT('tax') }</span>
                    <span>{ isRTL ? cartCalculations.tax.toFixed(2).replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) + "$" : cartCalculations.tax.toFixed(2) + "$"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>{cartT('total') }</span>
                    <span className="text-primary">{isRTL ? cartCalculations.total.toFixed(2).replace(/\d/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) + "$" : cartCalculations.total.toFixed(2) + "$"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={() => navigateToCheckout()}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-3"
                  >
                    {cartT('proceedTo')}
                    {isRTL ? (<ArrowLeft className="h-5 w-5 ml-2" />) : (<ArrowRight className="h-5 w-5 ml-2"/>)} 
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigateToProducts()}
                    className="w-full"
                  >
                    {cartT('continueShopping')}
                  </Button>
                </div>

                {/* Payment Methods */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center mb-2">{isRTL ? "نحن نقبل" : "We accept" }</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center ml-2">
                      VISA
                    </div>
                    <div className="w-8 h-6 bg-gradient-to-r from-red-600 to-orange-600 rounded text-white text-xs flex items-center justify-center ml-2">
                      MC
                    </div>
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs flex items-center justify-center ml-2">
                      PP
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}