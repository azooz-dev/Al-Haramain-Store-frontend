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
  otpEmail: boolean | null;
  otpVerified: boolean;
  token: string | null;
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

export interface RequestFailure {
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

export interface RegisterSuccess {
  success: boolean;
  requiresOTP?: boolean;
  email?: string;
}

export interface LogoutResponse {
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

export interface UpdateProfileRequest {
  userId: number;
  data: Partial<User>;
}

export interface UpdateProfileResponse {
  data: User;
  message: string;
  status: string;
}

export interface DeleteUserAccountRequest {
  userId: number;
}

export interface DeleteUserAccountResponse {
  data: User;
  message: string;
  status: string;
}