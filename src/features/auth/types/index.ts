export interface User {
  identifier: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  isVerified: boolean;
  createdDate: string;
  lastChange: string;
  addresses?: Address[];
}

export interface Address {
  identifier: number;
  addressType: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  is_default: boolean;
  createdDate: string;
  lastChange: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  password: string;
  password_confirmation: string;
}

export interface OTPRequest {
  otp: number;
  email: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}