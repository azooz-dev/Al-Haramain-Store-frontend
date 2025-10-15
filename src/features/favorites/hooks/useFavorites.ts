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
	addToFavorites,
	removeFromFavorites,
	setFavoritesError as setFavoritesErrorSlice,
	setFavoritesLoading,
	selectFavoritesLoading,
} from "@/store/slices/favoritesSlice";
import { FavoritesRemoveRequest, FavoritesAddRequest, Favorite } from "../types";
import { RequestFailure } from "@/shared/types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { useApp } from "@/shared/contexts/AppContext";

export const useFavorites = () => {
	const { currentUser } = useAuth();
	const { isRTL } = useApp();
	const dispatch = useAppDispatch();
	const [addFavoriteMutation] = useAddFavoriteMutation();
	const [removeFavoriteMutation] = useRemoveFavoriteMutation();
	const isLoadingFavorites = useAppSelector((state) => selectFavoritesLoading(state.favorites));
	const { data: favorites, error: favoritesError } = useGetUserFavoritesQuery(
		currentUser?.identifier as number,
		{
			skip: !currentUser?.identifier,
			refetchOnMountOrArgChange: true, // Force refetch when component mounts or args change
		}
	);

	useEffect(() => {
		if (favorites) {
			dispatch(setFavoritesSlice(favorites));
		}
		if (favoritesError) {
			const error = extractErrorMessage(favoritesError as RequestFailure);
			dispatch(setFavoritesErrorSlice(error));
		}
		if (isLoadingFavorites) {
			dispatch(setFavoritesLoading(isLoadingFavorites));
		}
	}, [favorites, favoritesError, isLoadingFavorites, dispatch]);

	const favoritesState = useAppSelector((state) => state.favorites);
	const isFavoriteByProductId = useCallback(
		(productId: number) => {
			if (!favoritesState.items) return null;
			return favoritesState.items?.find(
				(favorite: Favorite) => favorite.product.identifier === productId
			);
		},
		[favoritesState.items]
	);

	const addFavorite = useCallback(
		async (payload: FavoritesAddRequest): Promise<boolean> => {
			try {
				const response = await addFavoriteMutation(payload).unwrap();
				if (response.status === "success") {
					dispatch(addToFavorites(response.data));
					isFavoriteByProductId(response.data.product.identifier);
					return true;
				}
				return false;
			} catch (error: unknown) {
				console.log("error", error);
				dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure)));
				return false;
			}
		},
		[addFavoriteMutation, dispatch, isFavoriteByProductId]
	);

	const removeFavorite = useCallback(
		async (payload: FavoritesRemoveRequest): Promise<boolean> => {
			try {
				const response = await removeFavoriteMutation(payload).unwrap();
				if (response.status === "success") {
					dispatch(removeFromFavorites(payload.favoriteId));
					return true;
				}
				return false;
			} catch (error: unknown) {
				dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure)));
				return false;
			}
		},
		[removeFavoriteMutation, dispatch]
	);

	const toggleFavorite = useCallback(
		async (payload: FavoritesAddRequest | FavoritesRemoveRequest) => {
			const isFavoriteExist = isFavoriteByProductId((payload as FavoritesAddRequest).productId);
			if (isFavoriteExist && isFavoriteExist.identifier) {
				await removeFavorite({
					userId: (payload as FavoritesRemoveRequest).userId as number,
					favoriteId: isFavoriteExist.identifier as number,
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

	const favoritesCount = useMemo(() => {
		return favorites?.data.data?.length || 0;
	}, [favorites?.data.data]);

	return {
		addFavorite,
		removeFavorite,
		isLoadingFavorites,
		toggleFavorite,
		isFavorite: isFavoriteByProductId,
		filteredAndSortedFavorites,
		setFavoritesLoading,
		favoritesCount,
	};
};
