import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendCodeRequest,
  VerifyEmailRequest,
  ResendCodeResponse,
  VerifyEmailResponse,
  UpdateProfileRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  DeleteUserAccountResponse,
  DeleteUserAccountRequest,
  LogoutResponse,
} from './../types/index';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@store/store";
import { APP_CONFIG } from "@/shared/config/config";

// Helper function to get cookie value
const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${APP_CONFIG.apiBaseUrl}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {    
    // Add CSRF token if present (from meta tag or cookie)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
      getCookieValue("XSRF-TOKEN") ||
      getCookieValue("csrf-token");
    
    if (csrfToken) {
      headers.set("X-CSRF-TOKEN", csrfToken);
    }

    // Get auth token from localStorage and set in Authentication header
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");

    return headers;
  }
});

const baseQueryWithLocale: typeof rawBaseQuery = async (args, api, extra) => {
  const language = (api.getState() as RootState)?.ui?.language || "en";

  if (typeof args === "string") args = { url: args };
  if (typeof args === "object" && args.url !== "/sanctum/csrf-cookie") {
    (args.headers = new Headers(args.headers as HeadersInit)).set("X-locale", language);
  }

  return rawBaseQuery(args, api, extra);
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithLocale,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get CSRF cookie
    getCsrfCookie: builder.query<{ status: string }, void>({
      query: () => "/sanctum/csrf-cookie",
      keepUnusedDataFor: 0,
    }),

    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Register
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      })
    }),

    // Verify Email
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/users/email/verify-code",
        method: "POST",
        body: data
      }),
    }),

    // Resend verification code
    resendCode: builder.mutation<ResendCodeResponse, ResendCodeRequest>({
      query: (data) => ({
        url: "/users/email/resend-code",
        method: "POST",
        body: data,
      })
    }),

    // Forget password
    forgetPassword: builder.mutation<ForgetPasswordResponse, ForgetPasswordRequest>({
      query: (data) => ({
        url: "/forget-password",
        method: "POST",
        body: data
      })
    }),

    // Reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `/reset-password?${data.token}`,
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation
        },
      }),
    }),

    // Get current user
    getCurrentUser: builder.query<{ data: User }, void>({
      query: () => "/user",
      providesTags: [{ type: "User", id: "CURRENT" }],
      keepUnusedDataFor: 600, // cache for 10 minutes
    }),

    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: "CURRENT" },
        { type: 'User', id: userId }
      ],
    }),

    // Delete user account
    deleteAccount: builder.mutation<DeleteUserAccountResponse, DeleteUserAccountRequest>({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: "CURRENT" },
        { type: 'User', id: userId },
      ],
    })
  })
})

export const {
  useLazyGetCsrfCookieQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} = authApi;