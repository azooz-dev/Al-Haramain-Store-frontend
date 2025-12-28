import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoriesResponse, CategoryResponse } from "@/features/categories/types";

interface CategoriesState {
	categories: Category[];
	currentCategory: Category | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: CategoriesState = {
	categories: [],
	currentCategory: null,
	isLoading: false,
	error: null,
};

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<CategoriesResponse>) => {
			state.isLoading = false;
			state.error = null;
			state.categories = action.payload?.data?.data ?? [];
		},

		setCurrentCategory: (state, action: PayloadAction<CategoryResponse>) => {
			state.isLoading = false;
			state.error = null;
			state.currentCategory = action.payload.data;
		},

		setCategoryLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		setCategoryError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setCategories, setCurrentCategory, setCategoryLoading, setCategoryError } =
	categoriesSlice.actions;

export default categoriesSlice.reducer;
