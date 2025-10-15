import React from "react";
import { Flame, Gift } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useApp } from "@/shared/contexts/AppContext";
import { useOffers } from "../hooks/useOffers";
import { ProfessionalPagination } from "@/shared/components/common/ProfessionalPagination";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { OffersCard } from "./OffersCard";
import { Offer, TimeRemaining } from "../types";

export const OffersPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: offerT } = useFeatureTranslations("offers");
  const {
    offers,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    timeRemaining,
    discountPercentage,
    totalSavings,
    hasOffer,
    setCurrentPage
  } = useOffers();

    return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-card dark:from-card dark:via-card dark:to-card">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `url("${`https://images.unsplash.com/photo-1600616677773-0fbd06bd2727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc2xhbWljJTIwZ2VvbWV0cmljJTIwcGF0dGVybnMlMjBnb2xkfGVufDF8fHx8MTc1NzQ0ODM0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral`}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
              {offerT('offers.title')}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {isRTL 
                ? offerT('offers.description')
                : offerT('offers.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-4 pb-16 mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-card/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl">
                <CardContent className="p-0">
                  <div className="h-64 bg-muted animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Flame className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {offerT('offers.error')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {offerT('offers.errorDescription')}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {offerT('offers.retry')}
            </Button>
          </div>
        ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {offers.map((offer: Offer, index: number) => (
                <OffersCard key={offer.identifier} offer={offer} index={index} timeRemaining={timeRemaining(offer) as TimeRemaining} discountPercentage={discountPercentage(offer)} totalSavings={totalSavings(offer)} hasOffer={hasOffer} />
              ))}
            </div>
            {offers.length === 0 && (
              <div className="text-center py-16">
                <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {offerT('offers.noOffers')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {offerT('offers.noOffersDescription')}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-white/10">
                  <ProfessionalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    isLoading={isLoading}
                    showFirstLast={true}
                    maxVisiblePages={5}
                  />
                  
                  {/* Pagination Info */}
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    {offerT('offers.pagination', { 
                      from: (currentPage - 1) * perPage + 1, 
                      to: Math.min(currentPage * perPage, totalItems), 
                      total: totalItems 
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}