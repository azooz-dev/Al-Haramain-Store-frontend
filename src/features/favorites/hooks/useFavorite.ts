import { useCallback, useEffect, useMemo } from "react";
import {
	useGetUserFavoritesQuery,
	useAddFavoriteMutation,
	useRemoveFavoriteMutation,
} from "../services/favoriteApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setFavorites as setFavoritesSlice,
	setFavoritesError as setFavoritesErrorSlice,
	setFavoritesLoading as setFavoritesLoadingSlice,
	toggleFavorite as toggleFavoriteSlice,
	selectIsFavorite,
	selectFavoritesState,
} from "@/store/slices/favoritesSlice";
import { FavoritesRemoveRequest, FavoritesAddRequest, Favorite } from "../types";
import { RequestFailure } from "@/shared/types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { useApp } from "@/shared/contexts/AppContext";

export const useFavorite = () => {
	const { currentUser } = useAuth();
	const { isRTL } = useApp();
	const dispatch = useAppDispatch();
	const [addFavoriteMutation] = useAddFavoriteMutation();
	const [removeFavoriteMutation] = useRemoveFavoriteMutation();
	const {
		data: favorites,
		isLoading: isLoadingFavorites,
		error: favoritesError,
	} = useGetUserFavoritesQuery(currentUser?.identifier as number);

	useEffect(() => {
		if (favorites) {
			dispatch(setFavoritesSlice(favorites));
		}
		if (favoritesError) {
			const errorMessage =
				"message" in favoritesError
					? favoritesError.message || "Failed to fetch favorites"
					: "Failed to fetch favorites";
			dispatch(setFavoritesErrorSlice(errorMessage));
		}
		if (isLoadingFavorites) {
			dispatch(setFavoritesLoadingSlice(isLoadingFavorites));
		}
	}, [favorites, favoritesError, isLoadingFavorites, dispatch]);

	const favoritesState = useAppSelector(selectFavoritesState);

	const isFavoriteByProductId = useCallback(
		(productId: number) => {
			return selectIsFavorite(favoritesState, productId);
		},
		[favoritesState]
	);

	const addFavorite = useCallback(
		async (payload: FavoritesAddRequest): Promise<boolean> => {
			try {
				const response = await addFavoriteMutation(payload).unwrap();
				if (response.status === "success") {
					dispatch(toggleFavoriteSlice(response.data));
					return true;
				}
				return false;
			} catch (error: unknown) {
				dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure).data.message));
				return false;
			}
		},
		[addFavoriteMutation, dispatch]
	);

	const removeFavorite = useCallback(
		async (payload: FavoritesRemoveRequest): Promise<boolean> => {
			try {
				const response = await removeFavoriteMutation(payload).unwrap();
				if (response.status === "success") {
					dispatch(toggleFavoriteSlice(payload.favoriteId));
					return true;
				}
				return false;
			} catch (error: unknown) {
				dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure).data.message));
				return false;
			}
		},
		[removeFavoriteMutation, dispatch]
	);

	const toggleFavorite = useCallback(
		async (payload: FavoritesAddRequest | FavoritesRemoveRequest) => {
			if (isFavoriteByProductId((payload as FavoritesAddRequest).productId)) {
				await removeFavorite({
					userId: (payload as FavoritesRemoveRequest).userId as number,
					favoriteId: (payload as FavoritesRemoveRequest).favoriteId as number,
				});
			} else {
				await addFavorite(payload as FavoritesAddRequest);
			}
		},
		[addFavorite, removeFavorite, isFavoriteByProductId]
	);

	const filteredAndSortedFavorites = useMemo(
		() => (searchQuery: string, sortBy: string) => {
			return favorites?.data.data
				?.filter((favorite: Favorite) => {
					const productName = isRTL ? favorite.product.ar.title : favorite.product.en.title;
					return productName.toLowerCase().includes(searchQuery.toLowerCase());
				})
				.sort((a: Favorite, b: Favorite) => {
					switch (sortBy) {
						case "newest":
							return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
						case "oldest":
							return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
						case "price-low": {
							const priceA = a.product.variant?.amount_discount_price
								? parseFloat(a.product.variant.amount_discount_price)
								: parseFloat(a.product.variant?.price?.toString() || "0");
							const priceB = b.product.variant?.amount_discount_price
								? parseFloat(b.product.variant.amount_discount_price)
								: parseFloat(b.product.variant?.price?.toString() || "0");
							return priceA - priceB;
						}
						case "price-high": {
							const priceAHigh = a.product.variant?.amount_discount_price
								? parseFloat(a.product.variant.amount_discount_price)
								: parseFloat(a.product.variant?.price?.toString() || "0");
							const priceBHigh = b.product.variant?.amount_discount_price
								? parseFloat(b.product.variant.amount_discount_price)
								: parseFloat(b.product.variant?.price?.toString() || "0");
							return priceBHigh - priceAHigh;
						}
						default:
							return 0;
					}
				});
		},
		[favorites?.data.data, isRTL]
	);

	return {
		addFavorite,
		removeFavorite,
		isLoadingFavorites,
		toggleFavorite,
		isFavorite: isFavoriteByProductId,
		filteredAndSortedFavorites,
	};
};
