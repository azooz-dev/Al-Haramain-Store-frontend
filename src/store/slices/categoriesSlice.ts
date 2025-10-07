import { createSlice } from "@reduxjs/toolkit";

interface CategoriesState {
  categories: any[];
  isLoading: boolean;
  error: string | null
};

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {}
});

export default categoriesSlice.reducer;