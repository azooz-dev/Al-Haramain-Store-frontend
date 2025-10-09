import { LoginResponse, RegisterResponse, VerifyEmailResponse } from './../../features/auth/types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/features/auth/types";

interface AuthState {
  isAuthentication: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  otpEmail: boolean | null;
  otpVerified: boolean;
  token: string | null;
};

const initialState: AuthState = {
  isAuthentication: false,
  currentUser: null,
  isLoading: false,
  error: null,
  otpEmail: false,
  otpVerified: false,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isAuthentication = true;
      state.currentUser = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthentication = false;
      state.currentUser = null;
      state.isLoading = false;
      state.error = action.payload;
    },

    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<RegisterResponse>) => {
      state.isAuthentication = true;
      state.currentUser = action.payload.data;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Simplified OTP verification
    setOTPEmail: (state, action: PayloadAction<boolean>) => {
      state.otpEmail = action.payload;
      state.otpVerified = false;
    },

    verifyOTPSuccess: (state, action: PayloadAction<VerifyEmailResponse>) => {
      state.isAuthentication = true;
      state.currentUser = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = true;
    },

    verifyOTPFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.otpVerified = false;
    },

    // Logout action
    logout: (state) => {
      state.isAuthentication = false;
      state.currentUser = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export default authSlice.reducer;