import { Favorite, FavoritesResponse } from "@/features/favorites/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
	items: Favorite[];
	isLoading: boolean;
	error: string | null;
}

const initialState: FavoritesState = {
	items: [],
	isLoading: false,
	error: null,
};

const favoritesSlice = createSlice({
	name: "favorites",
	initialState,
	reducers: {
		setFavorites: (state, action: PayloadAction<FavoritesResponse>) => {
			state.isLoading = false;
			state.error = null;
			state.items = action.payload.data.data;
		},
		addToFavorites: (state, action: PayloadAction<Favorite>) => {
			const isAlreadyExists = state.items.some(
				(item) => item.product.identifier === action.payload.product.identifier
			);

			if (!isAlreadyExists) {
				state.items.unshift(action.payload);
			}
		},

		removeFromFavorites: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter((item) => item.product.identifier !== action.payload);
		},

		toggleFavorite: (state, action: PayloadAction<Favorite | number>) => {
			const favoriteIsExists = state.items.some(
				(item) => item.identifier === (action.payload as number)
			);

			if (favoriteIsExists) {
				removeFromFavorites(action.payload as number);
			} else {
				addToFavorites(action.payload as Favorite);
			}
		},

		clearAllFavorites: (state) => {
			state.items = [];
		},

		loadFavoritesFromStorage: (state, action: PayloadAction<Favorite[]>) => {
			state.items = action.payload;
		},

		setFavoritesLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		setFavoritesError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setFavorites,
	addToFavorites,
	toggleFavorite,
	removeFromFavorites,
	clearAllFavorites,
	loadFavoritesFromStorage,
	setFavoritesLoading,
	setFavoritesError,
} = favoritesSlice.actions;

// Selectors
export const selectFavoritesState = (state: { favorites: FavoritesState }) => state.favorites;
export const selectFavorites = (state: FavoritesState) => state.items;
export const selectFavoritesCount = (state: FavoritesState) => state.items.length;
export const selectIsFavorite = (state: FavoritesState, productId: number) =>
	state.items.some((item) => item.product.identifier === productId);
export const selectFavoritesLoading = (state: FavoritesState) => state.isLoading;
export const selectFavoritesError = (state: FavoritesState) => state.error;

export default favoritesSlice.reducer;
