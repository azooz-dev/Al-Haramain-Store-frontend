import React, { useCallback } from 'react';
import {
  Clock,
  Percent,
  ArrowLeft,
  ArrowRight,
  Star,
  ShoppingCart,
  Gift,
  Sparkles,
  TrendingDown,
  Package
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { OffersSkeleton } from './OffersSkeleton';
import { useApp } from '@/shared/contexts/AppContext';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { useParams } from 'react-router-dom';
import { useOffers } from '../hooks/useOffers';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { ProductCard } from '@/features/products/components/listing/ProductCard';
import { APP_CONFIG } from '@/shared/config/config';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useCart } from '@/features/cart/hooks/useCart';
import { useToast } from '@/shared/hooks/useToast';

export const OffersDetailsPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: offersT } = useFeatureTranslations("offers");
  const { offerId } = useParams<{ offerId: string }>();
  const { navigateToOffersDetails, navigateToOffers } = useNavigation();
  const {
    offer,
    isLoading,
    error,
    timeRemaining,
    totalSavings,
    discountPercentage
  } = useOffers(Number(offerId));
  const { handleAddToCart, getCartItem } = useCart();
  const { toast } = useToast();

  const onAddToCart = useCallback(() => {
    const cartItem = getCartItem(offer?.identifier as number);
    const quantityToAdded = cartItem ? 1 : 1;

    const success = handleAddToCart({
      identifier: (offer?.identifier as number) || 0,
      quantity: quantityToAdded,
      orderable: 'offer',
      price: parseFloat(offer?.offerPrice || '0'),
      amount_discount_price: parseFloat(offer?.productsTotalPrice || '0'),
      image: `${APP_CONFIG.apiBaseUrl}/storage/${offer?.picture}`,
      en: offer?.en as { title: string; details: string; } || { title: '', details: '' },
      ar: offer?.ar as { title: string; details: string; } || { title: '', details: '' },
    });

    if (success) {
      toast.success(offersT("details.successAddingToCart"));
    } else {
      toast.error(offersT("details.errorAddingToCart"));
    }
  }, [offer, handleAddToCart, getCartItem, toast, offersT]);

  if (isLoading) {
    return <OffersSkeleton />;
  }

  if (error || !offer) {
        return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {offersT("details.errorTitle")}
          </h1>
          <p className="text-muted-foreground mb-4">
            {offersT("details.errorDescription")}
          </p>
          <Button onClick={() => navigateToOffersDetails(Number(offerId))} variant="outline">
            {offersT("details.backToOffers")}
          </Button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen  from-amber-50 via-orange-50 to-yellow-50 dark:bg-card dark:from-card dark:via-card dark:to-card">
      {/* Back Button */}
      <div className={`container mx-auto px-4 pt-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Button 
          variant="ghost" 
          onClick={() => navigateToOffers()}
          className="mb-6 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          {isRTL ? (
            <>
              <ArrowRight className="w-4 h-4 ml-2" />
              {offersT("details.backToOffers")}
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {offersT("details.backToOffers")}
            </>
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                <ImageWithFallback
                  src={`${APP_CONFIG.apiBaseUrl}/storage/${offer.picture}`}
                  alt={isRTL ? offer.ar.title : offer.en.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Discount Badge */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-lg px-4 py-2">
                    <Percent className="w-5 h-5 mr-2" />
                    {discountPercentage(offer)}% {offersT("details.discountPercentage")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {isRTL ? offer.ar.title : offer.en.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {isRTL ? offer.ar.details : offer.en.details}
              </p>
            </div>

            {/* Countdown Timer */}
            {!timeRemaining(offer).expired ? (
              <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800/30">
                <CardContent className="!p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {offersT("details.offerEndsIn")}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {timeRemaining(offer).days}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {offersT("details.days")}
                      </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {timeRemaining(offer).hours}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {offersT("details.hours")}
                      </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {timeRemaining(offer).minutes}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {offersT("details.minutes")} {offersT("details.left")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {offersT("details.offerExpired")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {offersT("details.offerExpiredDescription")}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/30">
              <CardContent className="!p-6">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${parseFloat(offer.offerPrice).toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                      ${parseFloat(offer.productsTotalPrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-green-600 dark:text-green-400">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-lg font-semibold">
                      {offersT("details.youSave")} ${totalSavings(offer).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <Package className="w-4 h-4" />
                    {offer.products.length} {offersT("details.productsIncluded")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
              onClick={() => onAddToCart()}
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              {offersT("details.addOfferToCard")}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 pb-16">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm  dark:bg-card dark:from-card dark:via-card dark:to-card overflow-hidden">
          <CardHeader className="pb-0">
            <div className="relative">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.1)_0%,transparent_50%)]" />
              
              <div className="relative flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3  from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                      {offersT("details.offerProducts")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {offersT("details.offerProductsDescription", { count: offer.products.length })}
                    </p>
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full border border-emerald-200 dark:border-emerald-800/30">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      4.5
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full border border-blue-200 dark:border-blue-800/30">
                    <TrendingDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {discountPercentage(offer)}% {offersT("details.discountPercentage")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-4">
            {/* Enhanced products grid with creative layout */}
            <div className="relative">
              {/* Subtle background decoration */}
              <div className="absolute top-4 right-4 w-32 h-32  from-amber-100/50 to-orange-100/50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24  from-orange-100/50 to-amber-100/50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-full blur-2xl" />
              
              <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offer.products.map((product, index) => {
                  return (
                    <div
                      key={product.identifier}
                      className="group relative transform transition-all duration-500 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Product highlight ring */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm" />
                      
                      <ProductCard
                        product={product}
                      />
                      
                      {/* Floating offer badge */}
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
                            <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full shadow-lg transform rotate-12">
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              <span className="text-xs font-bold">
                                {offersT("details.featured")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Collection summary card */}
              <div className="mt-12 p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2  from-amber-500 to-orange-500 rounded-lg">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {offersT("details.totalSavingsInOffer")}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {offersT("details.totalSavingsDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalSavings(offer)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {discountPercentage(offer)}% {offersT("details.discount")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}