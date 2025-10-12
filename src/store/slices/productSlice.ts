import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, Category, Review } from "@/features/products/types";
import { PaginationData } from "@/features/products/types";

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  productsLoading: boolean;
  productsError: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
};

const initialState: ProductsState = {
  products: [],
  categories: [],
  featuredProducts: [],
  productsLoading: false,
  productsError: null,
  searchQuery: "",
  selectedCategory: null,
  sortBy: "newest",
  sortOrder: "desc",
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,
  totalItems: 1,
  perPage: 6
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
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.productsLoading = action.payload;
    },
    setProductsError: (state, action: PayloadAction<string | null>) => {
      state.productsError = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<'price' | 'rating' | 'newest'>) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },

    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.currentPage = 1;
    },

    setPaginationData: (state, action: PayloadAction<PaginationData>) => {
      state.currentPage = action.payload.currentPage;
      state.itemsPerPage = action.payload.itemsPerPage;
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
      state.selectedCategory = null;
      state.sortBy = "newest";
      state.sortOrder = "desc";
      state.currentPage = 1;
    }
  }
});

export const {
  setProducts,
  setCategories,
  setFeaturedProducts,
  setProductsLoading,
  setProductsError,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setPaginationData,
  setCurrentPage,
  setItemsPerPage,
  clearFilters
} = productsSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.products;
export const selectCategories = (state: { products: ProductsState }) => state.products.categories;
export const selectFeaturedProducts = (state: { products: ProductsState }) => state.products.featuredProducts;
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.productsLoading;
export const selectProductsError = (state: { products: ProductsState }) => state.products.productsError;
export const selectSearchQuery = (state: { products: ProductsState }) => state.products.searchQuery;
export const selectProductsByCategory = (category: string) => (state: { products: ProductsState }) => state.products.products.filter(product => product.categories?.some((cat: Category) => cat.identifier.toString() === category));
export const selectSortBy = (state: { products: ProductsState }) => state.products.sortBy;
export const selectSortOrder = (state: { products: ProductsState }) => state.products.sortOrder;
export const selectCurrentPage = (state: { products: ProductsState }) => state.products.currentPage;
export const selectItemsPerPage = (state: { products: ProductsState }) => state.products.itemsPerPage;
export const selectTotalItems = (state: { products: ProductsState }) => state.products.totalItems;
export const selectPerPage = (state: { products: ProductsState }) => state.products.perPage;
export const selectFilteredProducts = (state: { products: ProductsState }) => {
  const { products, searchQuery, selectedCategory, sortBy, sortOrder } = state.products;

  let filtered = Object.values(products);

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      const titleEn = product.en?.title.toLowerCase() || '';
      const titleAr = product.ar?.title.toLowerCase() || '';

      return titleEn.includes(searchLower) || titleAr.includes(searchLower);
    })

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categories?.some((cat: Category) => cat.identifier.toString() === selectedCategory)
      )
    }

    // Sort products
    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.min_price || a.min_price - b.min_price || b.min_price;
          break;
        case 'rating': {
          const ratingA = a.reviews?.length ? a.reviews.reduce((sum: number, review: Review) => sum + parseFloat(review.rating) || 0, 0) / a.reviews.length : 0;
          const ratingB = b.reviews?.length ? b.reviews.reduce((sum: number, review: Review) => sum + parseFloat(review.rating) || 0, 0) / b.reviews.length : 0;
          comparison = ratingB - ratingA;
          break;
        }
        case 'newest':
          comparison = new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    })
  }

  return filtered;
}
// Selector for paginated products
export const selectPaginatedProducts = (state: { products: ProductsState }) => {
  const filtered = selectFilteredProducts(state);
  const { currentPage, itemsPerPage } = state.products;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return Array.isArray(filtered) ? filtered.slice(startIndex, endIndex) : [];
}

// Selector for total pages
export const selectTotalPages = (state: { products: ProductsState }) => {
  const filtered = selectFilteredProducts(state);
  const { itemsPerPage } = state.products;

  return Array.isArray(filtered) ? Math.ceil(filtered.length / itemsPerPage) : 0;
}
export default productsSlice.reducer;