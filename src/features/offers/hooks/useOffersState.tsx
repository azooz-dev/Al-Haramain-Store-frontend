import { useCallback, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectOfferById } from "@/store/slices/offersSlice";

export const useOffersState = (offerId: number) => {
  const offer = useAppSelector(selectOfferById(offerId));

  
  // Format time remaining
  const formatTimeRemaining = useCallback((endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, seconds: 0, expired: false };
  }, []);

  // Calculate discount percentage
  const calculateDiscountPercentage = useCallback((originalPrice: string, offerPrice: string) => {
    const original = parseFloat(originalPrice);
    const offer = parseFloat(offerPrice);
    return Math.round(((original - offer) / original) * 100);
  }, []);

  // Computed values
  const timeRemaining = useMemo(() => {
    return offer ? formatTimeRemaining(offer.endDate) : { days: 0, hours: 0, minutes: 0, expired: true };
  }, [offer, formatTimeRemaining]);

  const totalSavings = useMemo(() => {
    return offer ? parseFloat(offer.productsTotalPrice) - parseFloat(offer.offerPrice) : 0;
  }, [offer]);

  const discountPercentage = useMemo(() => {
    return offer ? calculateDiscountPercentage(offer.productsTotalPrice, offer.offerPrice) : 0;
  }, [offer, calculateDiscountPercentage]);

  const offerSummary = useMemo(() => {
    if (!offer) return null;
    
    return {
      isExpired: timeRemaining.expired,
      totalProducts: offer.products.length,
      originalPrice: parseFloat(offer.productsTotalPrice),
      offerPrice: parseFloat(offer.offerPrice),
      savings: totalSavings,
      discountPercentage,
      timeRemaining,
    };
  }, [offer, timeRemaining, totalSavings, discountPercentage]);

  const isEmpty = useMemo(() => {
    return !offer;
  }, [offer]);

  const hasOffer = useMemo(() => {
    return !!offer;
  }, [offer]);



  return {
    offer,
    timeRemaining,
    totalSavings,
    discountPercentage,
    offerSummary,
    isEmpty,
    hasOffer,
  }
}