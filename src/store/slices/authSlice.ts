import { LoginResponse, RegisterResponse, VerifyEmailResponse, ProcessedError } from './../../features/auth/types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/features/auth/types";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  otpEmail: string | null;
  otpVerified: boolean;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  isLoading: false,
  error: null,
  otpEmail: null,
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
      state.isAuthenticated = true;
      state.currentUser = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    loginFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.isLoading = false;
      state.error = action.payload.data.message;
    },
    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<RegisterResponse>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.data;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    registerFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.error = action.payload.data.message;
      state.isLoading = false;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    // Simplified OTP verification
    otpSuccess: (state, action: PayloadAction<VerifyEmailResponse>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = true;
    },

    otpFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.isLoading = false;
      state.error = action.payload.data.message;
      state.otpVerified = false;
    },

    // Logout actions
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    logoutFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.error = action.payload.data.message;
      state.isLoading = false;
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

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  otpSuccess,
  otpFailure,
  logout,
  logoutFailure,
  clearError,
  setAuthLoading
} = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectOTPEmail = (state: { auth: AuthState }) => state.auth.otpEmail;
export const selectOTPVerified = (state: { auth: AuthState }) => state.auth.otpVerified;


export default authSlice.reducer;