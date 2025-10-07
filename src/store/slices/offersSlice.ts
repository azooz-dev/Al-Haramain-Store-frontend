import { createSlice } from "@reduxjs/toolkit";

interface OffersState {
  offers: any[];
  isLoading: boolean;
  error: string | null
};

const initialState: OffersState = {
  offers: [],
  isLoading: false,
  error: null
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {}
});

export default offersSlice.reducer;