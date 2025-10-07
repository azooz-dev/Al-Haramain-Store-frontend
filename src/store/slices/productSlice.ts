import { createSlice } from "@reduxjs/toolkit";

interface ProductsState {
  products: any[];
  categories: any[];
  featuredProducts: any[];
  isLoading: boolean;
  error: string | null
};

const initialState: ProductsState = {
  products: [],
  categories: [],
  featuredProducts: [],
  isLoading: false,
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {}
});

export default productsSlice.reducer;