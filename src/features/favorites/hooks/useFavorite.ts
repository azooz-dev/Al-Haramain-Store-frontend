import { useEffect } from "react";
import {
	useGetUserFavoritesQuery,
	useAddFavoriteMutation,
	useRemoveFavoriteMutation,
} from "../services/favoriteApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import {
	setFavorites as setFavoritesSlice,
	setFavoritesError as setFavoritesErrorSlice,
	setFavoritesLoading as setFavoritesLoadingSlice,
	addToFavorites as addToFavoritesSlice,
	removeFromFavorites as removeFromFavoritesSlice,
} from "@/store/slices/favoritesSlice";
import { FavoritesRemoveRequest, FavoritesAddRequest } from "../types";
import { RequestFailure } from "@/shared/types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";

export const useFavorite = () => {
	const { currentUser } = useAuth();
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

	const addFavorite = async (payload: FavoritesAddRequest): Promise<boolean> => {
		try {
			const response = await addFavoriteMutation(payload).unwrap();
			if (response.status === "success") {
				dispatch(addToFavoritesSlice(response.data));
				return true;
			}
			return false;
		} catch (error: unknown) {
			dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure).data.message));
			return false;
		}
	};

	const removeFavorite = async (payload: FavoritesRemoveRequest): Promise<boolean> => {
		try {
			const response = await removeFavoriteMutation(payload).unwrap();
			if (response.status === "success") {
				dispatch(removeFromFavoritesSlice(payload.favoriteId));
				return true;
			}
			return false;
		} catch (error: unknown) {
			dispatch(setFavoritesErrorSlice(extractErrorMessage(error as RequestFailure).data.message));
			return false;
		}
	};

	return {
		addFavorite,
		removeFavorite,
	};
};
