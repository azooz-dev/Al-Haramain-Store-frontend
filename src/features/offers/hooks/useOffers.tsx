import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetOffersQuery } from "../services/offerApi";
import { setOffers, setOffersError, setOffersLoading, selectOffers, setPaginationData } from "@/store/slices/offersSlice";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";
import { useOffersState } from "./useOffersState";

export const useOffers = (offerId?: number) => {
  const dispatch = useAppDispatch();
  const offersState = useAppSelector(selectOffers);
  const { data: offersData, isLoading: isOffersLoading, error: offersError } = useGetOffersQuery({
    page: offersState.currentPage,
    per_page: offersState.perPage,
  });

  useEffect(() => {
    if (offersData) {
      dispatch(setOffers(offersData.data.data));
    }
    if (offersError) {
      const error = extractErrorMessage(offersError as RequestFailure);
      dispatch(setOffersError(error));
    }
    if (isOffersLoading) {
      dispatch(setOffersLoading(isOffersLoading));
    }
  }, [offersData, offersError, isOffersLoading, dispatch]);

	const updatePaginationData = useCallback(() => {
		if (offersData?.data) {
			dispatch(
				setPaginationData({
					currentPage: offersState.currentPage,
					totalPages: offersState.totalPages,
					totalItems: offersState.totalItems,
					perPage: offersState.perPage,
				})
			);
		}
	}, [offersData, dispatch, offersState]);

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
    updatePaginationData,
  };
}