import { Favorite } from "@/features/favorites/types";
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

		toggleFavorite: (state, action: PayloadAction<Favorite>) => {
			const existingIndex = state.items.findIndex(
				(item) => item.product.identifier === action.payload.product.identifier
			);

			if (existingIndex >= 0) {
				state.items.splice(existingIndex, 1);
			} else {
				state.items.unshift(action.payload);
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
	addToFavorites,
	removeFromFavorites,
	toggleFavorite,
	clearAllFavorites,
	loadFavoritesFromStorage,
	setFavoritesLoading,
	setFavoritesError,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
export const selectFavoritesCount = (state: { favorites: FavoritesState }) =>
	state.favorites.items.length;
export const selectIsFavorite = (state: { favorites: FavoritesState }, productId: number) =>
	state.favorites.items.some((item) => item.product.identifier === productId);
export const selectFavoritesLoading = (state: { favorites: FavoritesState }) =>
	state.favorites.isLoading;
export const selectFavoritesError = (state: { favorites: FavoritesState }) => state.favorites.error;

export default favoritesSlice.reducer;
