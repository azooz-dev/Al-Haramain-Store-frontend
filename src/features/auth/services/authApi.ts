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
} from "./../types/index";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/shared/api/baseQuery";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,
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
				url: "/api/login",
				method: "POST",
				body: credentials,
			}),
		}),

		// Register
		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: (userData) => ({
				url: "/api/register",
				method: "POST",
				body: userData,
			}),
		}),

		logout: builder.mutation<LogoutResponse, void>({
			query: () => ({
				url: "/api/logout",
				method: "POST",
			}),
		}),

		// Verify Email
		verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
			query: (data) => ({
				url: "/api/users/email/verify-code",
				method: "POST",
				body: data,
			}),
		}),

		// Resend verification code
		resendCode: builder.mutation<ResendCodeResponse, ResendCodeRequest>({
			query: (data) => ({
				url: "/api/users/email/resend-code",
				method: "POST",
				body: data,
			}),
		}),

		// Forget password
		forgetPassword: builder.mutation<ForgetPasswordResponse, ForgetPasswordRequest>({
			query: (data) => ({
				url: "/api/forget-password",
				method: "POST",
				body: data,
			}),
		}),

		// Reset password
		resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
			query: (data) => ({
				url: `/api/reset-password?${data.token}`,
				method: "POST",
				body: data,
			}),
		}),

		// Get current user
		getCurrentUser: builder.query<{ data: User }, void>({
			query: () => "/api/user",
			providesTags: [{ type: "User", id: "CURRENT" }],
			keepUnusedDataFor: 600, // cache for 10 minutes
		}),

		updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
			query: ({ userId, data }) => ({
				url: `/api/users/${userId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "User", id: "CURRENT" },
				{ type: "User", id: userId },
			],
		}),

		// Delete user account
		deleteAccount: builder.mutation<DeleteUserAccountResponse, DeleteUserAccountRequest>({
			query: ({ userId }) => ({
				url: `/api/users/${userId}`,
				method: "DELETE",
			}),

			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "User", id: "CURRENT" },
				{ type: "User", id: userId },
			],
		}),
	}),
});

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
