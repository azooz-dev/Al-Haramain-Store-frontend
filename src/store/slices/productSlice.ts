import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/features/products/types";
import { Category } from "@/features/categories/types";
import { PaginationData } from "@shared/types";

interface ProductsState {
	products: Product[];
	categories: Category[];
	featuredProducts: Product[];
	isLoading: boolean;
	error: string | null;
	searchQuery: string;
	selectedCategories: number[];
	sortBy: "rating" | "newest" | "oldest" | "price-low" | "price-high" | "price-asc" | "price-desc";
	// Pagination
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
}

const initialState: ProductsState = {
	products: [],
	categories: [],
	featuredProducts: [],
	isLoading: false,
	error: null,
	searchQuery: "",
	selectedCategories: [],
	sortBy: "newest",
	currentPage: 1,
	itemsPerPage: 6,
	totalPages: 1,
	totalItems: 1,
	perPage: 6,
};

const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		setProducts: (state, action: PayloadAction<Product[]>) => {
			state.products = action.payload;
		},
		setCategories: (state, action: PayloadAction<Category[]>) => {
			state.categories = action.payload;
		},
		setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
			state.featuredProducts = action.payload;
		},
		setSelectedCategories: (state, action: PayloadAction<number[]>) => {
			state.selectedCategories = action.payload;
		},
		toggleSelectedCategory: (state, action: PayloadAction<number>) => {
			const categoryId = action.payload;
			if (!state.selectedCategories) {
				state.selectedCategories = [];
			}
			const index = state.selectedCategories.indexOf(categoryId);
			if (index > -1) {
				state.selectedCategories.splice(index, 1);
			} else {
				state.selectedCategories.push(categoryId);
			}
		},
		setProductsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setProductsError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
			state.currentPage = 1;
		},
		setSortBy: (
			state,
			action: PayloadAction<
				"rating" | "newest" | "oldest" | "price-low" | "price-high" | "price-asc" | "price-desc"
			>
		) => {
			state.sortBy = action.payload;
			state.currentPage = 1;
		},

		setPaginationData: (state, action: PayloadAction<PaginationData>) => {
			state.currentPage = action.payload.currentPage;
			state.totalPages = action.payload.totalPages;
			state.totalItems = action.payload.totalItems;
			state.perPage = action.payload.perPage;
		},

		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},

		setItemsPerPage: (state, action: PayloadAction<number>) => {
			state.itemsPerPage = action.payload;
		},

		clearFilters: (state) => {
			state.searchQuery = "";
			state.selectedCategories = [];
			state.sortBy = "newest";
			state.currentPage = 1;
		},
	},
});

export const {
	setProducts,
	setCategories,
	setFeaturedProducts,
	setSelectedCategories,
	toggleSelectedCategory,
	setProductsLoading,
	setProductsError,
	setSearchQuery,
	setSortBy,
	setPaginationData,
	setCurrentPage,
	setItemsPerPage,
	clearFilters,
} = productsSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products;
export const selectCategories = (state: { products: ProductsState }) => state.products.categories;
export const selectFeaturedProducts = (state: { products: ProductsState }) =>
	state.products.featuredProducts;
// Create a constant empty array to avoid creating new references
const EMPTY_CATEGORIES_ARRAY: number[] = [];

export const selectSelectedCategories = (state: { products: ProductsState }) =>
	state.products.selectedCategories || EMPTY_CATEGORIES_ARRAY;
export const selectIsLoading = (state: { products: ProductsState }) => state.products.isLoading;
export const selectError = (state: { products: ProductsState }) => state.products.error;
export const selectSearchQuery = (state: { products: ProductsState }) => state.products.searchQuery;
export const selectProductsByCategory =
	(category: string) => (state: { products: ProductsState }) =>
		state.products.products.filter((product) =>
			product.categories?.some((catId: number) => catId.toString() === category)
		);
export const selectSortBy = (state: { products: ProductsState }) => state.products.sortBy;
export const selectCurrentPage = (state: { products: ProductsState }) => state.products.currentPage;
export const selectItemsPerPage = (state: { products: ProductsState }) =>
	state.products.itemsPerPage;
export const selectTotalItems = (state: { products: ProductsState }) => state.products.totalItems;
export const selectPerPage = (state: { products: ProductsState }) => state.products.perPage;
export default productsSlice.reducer;
