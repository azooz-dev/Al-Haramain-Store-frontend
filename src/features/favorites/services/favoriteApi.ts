import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_CONFIG } from "@/shared/config/config";
import {
	FavoritesResponse,
	FavoriteAddResponse,
	FavoritesRemoveRequest,
	FavoritesAddRequest,
	FavoritesRemoveResponse,
} from "../types";
import { RootState } from "@store/store";
import { getCookieValue } from "@/shared/utils/getCookieValue";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";

const baseQuery = fetchBaseQuery({
	baseUrl: `${APP_CONFIG.apiBaseUrl}/api`,
	credentials: "include",
	validateStatus: (response) => response.status >= 200 && response.status < 300,
	prepareHeaders: (headers, { getState }) => {
		const language = (getState() as RootState)?.ui?.language || "en";
		headers.set("X-locale", language);

		// Get CSRF token from meta tag or cookie
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

export const favoriteApi = createApi({
	reducerPath: "favoriteApi",
	baseQuery: baseQuery,
	tagTypes: ["Favorite"],
	endpoints: (builder) => ({
		getUserFavorites: builder.query<FavoritesResponse, number>({
			query: (userId) => ({
				url: `/users/${userId}/favorites`,
				method: "GET",
			}),
			providesTags: (result) => [
				{ type: "Favorite", id: "LIST" },
				...(result?.data?.data?.map(({ identifier }) => ({
					type: "Favorite" as const,
					id: identifier,
				})) || []),
			],
			keepUnusedDataFor: 300,
		}),

		addFavorite: builder.mutation<FavoriteAddResponse, FavoritesAddRequest>({
			query: ({ userId, productId, colorId, variantId }) => ({
				url: `/users/${userId}/products/${productId}/colors/${colorId}/variants/${variantId}/favorites`,
				method: "POST",
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: (_, __, { userId }) => [
				{ type: "Favorite", id: "LIST" },
				{ type: "Favorite", id: userId }, // Invalidate user-specific cache
			],
		}),

		removeFavorite: builder.mutation<FavoritesRemoveResponse, FavoritesRemoveRequest>({
			query: ({ userId, favoriteId }) => ({
				url: `/users/${userId}/favorites/${favoriteId}`,
				method: "DELETE",
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: (_, __, { userId }) => [
				{ type: "Favorite", id: "LIST" },
				{ type: "Favorite", id: userId }, // Invalidate user-specific cache
			],
		}),
	}),
});

export const { useGetUserFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } =
	favoriteApi;
