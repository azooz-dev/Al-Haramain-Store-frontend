import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Percent, Clock, ArrowLeft, ArrowRight, Gift } from "lucide-react";
import { useApp } from "@/shared/contexts/AppContext";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { ImageWithFallback } from "@/shared/components/common/ImageWithFallback";
import { APP_CONFIG } from "@/shared/config/config";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { Button } from "@/shared/components/ui/button";
import { Offer, TimeRemaining } from "../types";

interface OffersCardProps {
  offer: Offer;
  index: number;
  timeRemaining: TimeRemaining;
  discountPercentage: number;
  totalSavings: number;
  hasOffer: boolean;
}

export const OffersCard: React.FC<OffersCardProps> = ({ offer, index, timeRemaining, discountPercentage, totalSavings, hasOffer }) => {
    const { isRTL } = useApp();
    const { navigateToOffersDetails } = useNavigation();
    const { t: offersT } = useFeatureTranslations("offers");

    return (
      <Card
        className="group relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30 hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-amber-400/5 transition-all duration-500 cursor-pointer backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4"
        onClick={() => navigateToOffersDetails(offer.identifier)}
        style={{ 
          animationDelay: `${index * 150}ms`,
          animationDuration: '800ms',
          animationFillMode: 'both'
        }}
      >
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />

        {/* Discount Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
            <Percent className="w-3 h-3 mr-1" />
            {discountPercentage}% {offersT("card.discountPercentage")}
          </Badge>
        </div>

        <CardContent className="p-0">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            <ImageWithFallback
              src={`${APP_CONFIG.apiBaseUrl}/storage/${offer.picture}`}
              alt={isRTL ? offer.ar.title : offer.en.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Time Remaining */}
            {!timeRemaining.expired && hasOffer && (
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                {timeRemaining.days > 0 
                  ? `${timeRemaining.days} ${offersT("card.days")}`
                  : `${timeRemaining.hours} ${offersT("card.hours")}`
                } {offersT("card.left")}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {isRTL ? offer.ar.title : offer.en.title}
              </h3>
            </div>

            {/* Products Count */}
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Gift className="w-4 h-4" />
              {offer.products.length} {offersT("card.products")} {offersT("card.included")}
            </div>

            {/* Pricing */}
            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${offer.offerPrice || 0}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  ${offer.productsTotalPrice || 0}
                </span>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                {offersT("card.youSave")} ${totalSavings.toFixed(2)}
              </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                navigateToOffersDetails(offer.identifier);
              }}
            >
              <span>{offersT("card.viewDetails")}</span>
              {isRTL ? (
                <ArrowLeft className="w-4 h-4 ml-2 group-hover/btn:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };