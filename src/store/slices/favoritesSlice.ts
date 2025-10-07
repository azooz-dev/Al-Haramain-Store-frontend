import { createSlice } from "@reduxjs/toolkit";

interface FavoritesState {
  items: any[];
  isLoading: boolean;
  error: string | null
};

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {}
});

export default favoritesSlice.reducer;