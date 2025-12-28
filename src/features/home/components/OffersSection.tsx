import React from 'react';
import { ArrowRight, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useOffers } from '@/features/offers/hooks/useOffers';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { APP_CONFIG } from '@/shared/config/config';

export const OffersSection: React.FC = () => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToOffers } = useNavigation();
  const { offers, isLoading, discountPercentage, timeRemaining } = useOffers();

  const offer = offers[0];

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {homeT("offers.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isRTL
                ? homeT("offers.description")
                : homeT("offers.description")
              }
            </p>
            <div className="mt-10">
              <div className="animate-pulse bg-muted rounded-3xl mx-auto w-[1372px] h-[168px]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-2xl mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {homeT("offers.noOffers")}
            </h3>
            <p className="text-muted-foreground">
              {homeT("offers.noOffersDescription")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            {homeT("offers.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL
              ? homeT("offers.description")
              : homeT("offers.description")
            }
          </p>
        </div>

        {/* Main Creative Banner */}
        <div className="relative group mb-12">
          <div
            className="relative h-32 md:h-40 lg:h-48 rounded-3xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-3xl"
            onClick={() => navigateToOffers()}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

            {/* Background Image Overlay */}
            {offer?.picture && (
              <div className="absolute inset-0 opacity-20">
                <ImageWithFallback
                  src={`${APP_CONFIG.apiBaseUrl}/storage/${offer.picture}`}
                  alt={isRTL ? offer.ar.title : offer.en.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping" />
            <div className="absolute bottom-6 left-6 w-3 h-3 bg-white/40 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/80 rounded-full animate-bounce" />

            {/* Content */}
            <div className={`relative h-full flex items-center justify-between px-8 md:px-12 lg:px-16 ${isRTL ? 'flex-row-reverse' : 'flex-row-reverse'}`}>
              {/* Left Side - CTA Button */}
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToOffers();
                  }}
                  className="bg-white text-red-600 hover:bg-red-50 px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-sm md:text-base"
                >
                  {homeT("offers.shopNow")}
                  {isRTL ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>

              {/* Right Side - Offer Text */}
              <div className={`flex-1 ${isRTL ? '' : 'flex-row-reverse'}`}>
                <div className="space-y-2">
                  <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                    {homeT("offers.discoverOurAmazingProducts")}
                  </h3>
                  {offer && (
                    <div className={`flex items-center justify-start gap-3 `}>
                      <span className="text-white/90 text-sm md:text-base">
                        {homeT("offers.discountUpTo")} {discountPercentage(offer)}% {homeT("offers.discountPercentage")}
                      </span>
                      {(timeRemaining(offer).days > 0 || timeRemaining(offer).hours > 0) && (
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-white text-xs">
                            {timeRemaining(offer).days} {homeT("offers.card.days")} {timeRemaining(offer).hours} {homeT("offers.card.hours")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <Sparkles className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {homeT("offers.clickToExploreAllOffers")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}