import { createApi } from "@reduxjs/toolkit/query/react";
import {
	FavoritesResponse,
	FavoriteAddResponse,
	FavoritesRemoveRequest,
	FavoritesAddRequest,
	FavoritesRemoveResponse,
} from "../types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";
import { baseQueryWithReauth } from "@/shared/api/baseQuery";

export const favoriteApi = createApi({
	reducerPath: "favoriteApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Favorite"],
	endpoints: (builder) => ({
		getUserFavorites: builder.query<FavoritesResponse, number>({
			query: (userId) => ({
				url: `/api/users/${userId}/favorites`,
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
				url: `/api/users/${userId}/products/${productId}/colors/${colorId}/variants/${variantId}/favorites`,
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
				url: `/api/users/${userId}/favorites/${favoriteId}`,
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
