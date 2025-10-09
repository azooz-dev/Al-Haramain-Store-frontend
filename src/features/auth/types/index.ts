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

export interface LoginResponse {
  data: {
    user: User,
    token: string
  };
  message: string;
  status: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  data: User;
  message: string;
  status: string;
}

export interface VerifyEmailRequest {
  code: string;
  email: string;
}

export interface VerifyEmailResponse {
  data: {
    user: User;
    token: string;
  };
  message: string;
  status: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface ResendCodeResponse {
  data: User;
  message: string;
  status: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  message: string;
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface updateProfileRequest {
  userId: number;
  data: Partial<User>;
}

export interface updateProfileResponse {
  data: User;
  message: string;
  status: string;
}

export interface deleteUserAccountRequest {
  userId: number;
}

export interface deleteUserAccountResponse {
  data: User;
  message: string;
  status: string;
}