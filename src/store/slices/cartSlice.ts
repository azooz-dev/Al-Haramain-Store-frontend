import { createSlice } from "@reduxjs/toolkit";

interface CartState {
  items: [];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {}
});

export default cartSlice.reducer;