import { RootState } from "./../../../store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_CONFIG } from "@/shared/config/config";
import { getCookieValue } from "@/shared/utils/getCookieValue";
import { User } from "@/features/auth/types";
import {
	DeleteUserRequest,
	DeleteUserResponse,
	UpdateUserRequest,
	UpdateUserResponse,
	GetUserOrdersRequest,
	UserOrdersResponse,
	CreateReviewResponse,
	CreateReviewRequest,
} from "../types";

const rawBaseQuery = fetchBaseQuery({
	baseUrl: APP_CONFIG.apiBaseUrl,
	credentials: "include",
	validateStatus: (response) => response.status >= 200 && response.status < 300,
	prepareHeaders: (headers, { getState }) => {
		const language = (getState() as RootState)?.ui?.language || "en";
		headers.set("X-locale", language);

		const csrfToken =
			document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
			getCookieValue("XSRF-TOKEN") ||
			getCookieValue("csrf-token");

		if (csrfToken) {
			headers.set("X-CSRF-TOKEN", csrfToken);
		}

		const authToken = localStorage.getItem("auth_token");
		if (authToken) {
			headers.set("Authorization", `Bearer ${authToken}`);
		}

		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");
		headers.set("X-Requested-With", "XMLHttpRequest");
		return headers;
	},
});

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: rawBaseQuery,
	tagTypes: ["User"],
	endpoints: (builder) => ({
		getUser: builder.query<{ data: User }, void>({
			query: () => "/api/user",
			providesTags: [{ type: "User", id: "CURRENT" }],
		}),

		updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
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

		deleteUser: builder.mutation<DeleteUserResponse, DeleteUserRequest>({
			query: ({ userId }) => ({
				url: `/api/users/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "User", id: "CURRENT" },
				{ type: "User", id: userId },
			],
		}),

		getUserOrders: builder.query<UserOrdersResponse, GetUserOrdersRequest>({
			query: ({ userId }) => `/api/users/${userId}/orders`,
			keepUnusedDataFor: 300,
			providesTags: [{ type: "User", id: "ORDERS" }],
		}),

		createReview: builder.mutation<CreateReviewResponse, CreateReviewRequest>({
			query: ({ userId, orderId, itemId, rating, comment }) => ({
				url: `/api/users/${userId}/orders/${orderId}/items/${itemId}/reviews`,
				method: "POST",
				body: { rating, comment },
			}),
			invalidatesTags: (_result, _error, { userId, orderId, itemId }) => [
				{ type: "User", id: "ORDERS" },
				{ type: "User", id: userId },
				{ type: "User", id: orderId },
				{ type: "User", id: itemId },
			],
		}),
	}),
});

export const {
	useGetUserQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useGetUserOrdersQuery,
	useCreateReviewMutation,
} = usersApi;
