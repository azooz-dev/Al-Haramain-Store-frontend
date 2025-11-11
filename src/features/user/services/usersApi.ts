import { RootState } from "./../../../store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_CONFIG } from "@/shared/config/config";
import { getCookieValue } from "@/shared/utils/getCookieValue";
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
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import type { RequestFailure } from "@/shared/types";

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
		updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
			query: ({ userId, data }) => ({
				url: `/api/users/${userId}`,
				method: "PUT",
				body: data,
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
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
			query: ({ userId, orderId, itemId, rating, comment, locale }) => ({
				url: `/api/users/${userId}/orders/${orderId}/items/${itemId}/reviews`,
				method: "POST",
				body: { rating, comment, locale },
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
	useUpdateUserMutation,
	useDeleteUserMutation,
	useGetUserOrdersQuery,
	useCreateReviewMutation,
} = usersApi;
