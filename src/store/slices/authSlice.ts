import { LoginResponse, RegisterResponse, VerifyEmailResponse } from './../../features/auth/types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/features/auth/types";
import { ProcessedError } from "@/shared/types";

/**
 * Safely extracts error message as a string, handling cases where
 * the message might be an object (validation errors from API)
 */
const getErrorMessage = (payload: ProcessedError): string => {
  const message = payload?.data?.message;
  if (typeof message === 'string') {
    return message;
  }
  if (typeof message === 'object' && message !== null) {
    // Handle validation error objects like { Email: ["error message"] }
    const values = Object.values(message).flat();
    for (const val of values) {
      if (typeof val === 'string') return val;
    }
  }
  return 'An error occurred';
};

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  otpEmail: string | null;
  otpVerified: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  isLoading: false,
  error: null,
  otpEmail: null,
  otpVerified: false,
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
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    loginFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.isLoading = false;
      state.error = getErrorMessage(action.payload);
    },
    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<RegisterResponse>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.data;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    registerFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.error = getErrorMessage(action.payload);
      state.isLoading = false;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    // Simplified OTP verification
    otpSuccess: (state, action: PayloadAction<VerifyEmailResponse>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.data.user;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = true;
    },

    otpFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.isLoading = false;
      state.error = getErrorMessage(action.payload);
      state.otpVerified = false;
    },

    // Logout actions
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
      state.otpEmail = null;
      state.otpVerified = false;
    },

    logoutFailure: (state, action: PayloadAction<ProcessedError>) => {
      state.error = getErrorMessage(action.payload);
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
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectOTPEmail = (state: { auth: AuthState }) => state.auth.otpEmail;
export const selectOTPVerified = (state: { auth: AuthState }) => state.auth.otpVerified;


export default authSlice.reducer;