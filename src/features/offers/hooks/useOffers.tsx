import { useCallback, useEffect, } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetOffersQuery } from "../services/offerApi";
import { setOffers, setOffersError, setOffersLoading, selectOffers, setCurrentPage as setCurrentPageAction } from "@/store/slices/offersSlice";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";
import { useOffersState } from "./useOffersState";
import { Offer, OfferTransformedResponse } from "../types";
import { ProductColor } from "@/features/products/types";
import { APP_CONFIG } from "@/shared/config/config";

export const useOffers = (offerId?: number) => {
  const dispatch = useAppDispatch();
  const offersState = useAppSelector(selectOffers);
  const url = APP_CONFIG.apiBaseUrl;
  const { data: offersData, isLoading: isOffersLoading, error: offersError } = useGetOffersQuery({
    page: offersState.currentPage,
    per_page: offersState.perPage,
  });

  const transformApiOffer = useCallback((offers: OfferTransformedResponse[]): Offer[] => {
    return offers.map((offer) => ({
      identifier: offer.identifier,
      picture: offer.picture,
      productsTotalPrice: offer.productsTotalPrice,
      offerPrice: offer.offerPrice,
      startDate: offer.startDate,
      endDate: offer.endDate,
      products: offer.products.map((product) => ({
        identifier: product.identifier,
        slug: product.slug,
        sku: product.sku,
        stock: product.quantity,
        en: product.en,
        ar: product.ar,
        colors: product.color.id ? [{
          id: product.color.id,
          color_code: product.color.color_code || '',
          images: product.color.images || [],
          variants: product.variant ? [{
            id: product.variant.id || 0,
            size: product.variant.size || '',
            price: product.variant.price || 0,
            amount_discount_price: product.variant.amount_discount_price || '0',
            quantity: product.variant.quantity || 0,
          }] : []
        } as ProductColor] : [],
        reviews: [],
        categories: [],
        min_price: product.variant.price || 0,
        max_price: product.variant.price || 0,
        price_range: product.variant.price?.toString() || '0',
        createdDate: offer.createdDate,
        lastChange: offer.lastChange,
        total_images_count: product.color.images?.length || 0,
        available_sizes: [product.variant.size || ''],
        available_colors: [product.color.color_code || ''],
        price: product.variant.price || 0,
        amount_discount_price: product.variant.amount_discount_price ? parseFloat(product.variant.amount_discount_price) : 0,
        image: product.image.image_url ? `${url}/storage/${product.image.image_url}` : '',
        discount: product.variant.amount_discount_price && product.variant.price ?
          Math.round(((product.variant.price - parseFloat(product.variant.amount_discount_price)) / product.variant.price) * 100) : 0,
        firstColorId: product.color.id,
        firstVariantId: product.variant.id,
        rating: 0,
        reviewCount: 0,
        isNew: false,
      })),
      en: offer.en,
      ar: offer.ar,
      createdDate: offer.createdDate,
      lastChange: offer.lastChange,
    }));
  }, [url]);

  useEffect(() => {
    if (offersData?.data?.data && Array.isArray(offersData.data.data)) {
      dispatch(setOffers(transformApiOffer(offersData.data.data)));
    }
    if (offersError) {
      const error = extractErrorMessage(offersError as RequestFailure);
      dispatch(setOffersError(error));
    }
    if (isOffersLoading) {
      dispatch(setOffersLoading(isOffersLoading));
    }
  }, [offersData, offersError, isOffersLoading, dispatch, transformApiOffer]);

  const setCurrentPage = (page: number) => {
    dispatch(setCurrentPageAction(page));
  };

  return {
    ...useOffersState(offerId as number),
    isLoading: isOffersLoading,
    error: offersError,
    offers: offersState.offers,
    currentPage: offersState.currentPage,
    itemsPerPage: offersState.itemsPerPage,
    totalPages: offersState.totalPages,
    totalItems: offersState.totalItems,
    perPage: offersState.perPage,
    setCurrentPage,
  };
}