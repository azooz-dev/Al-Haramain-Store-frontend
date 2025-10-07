import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthentication: boolean;
  currentUser: any | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  isAuthentication: false,
  currentUser: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
});

export default authSlice.reducer;