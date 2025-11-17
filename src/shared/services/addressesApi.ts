import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@store/store";
import {
	CreateAddressRequest,
	AddressResponse,
	UpdateAddressRequest,
	DeleteAddressRequest,
	DeleteAddressResponse,
	AddressesResponse,
} from "../types";
import { APP_CONFIG } from "../config/config";
import { getCookieValue } from "../utils/getCookieValue";
import { extractErrorMessage } from "../utils/extractErrorMessage";
import { RequestFailure } from "../types";

const baseQuery = fetchBaseQuery({
	baseUrl: APP_CONFIG.apiBaseUrl,
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

export const addressApi = createApi({
	reducerPath: "addressesApi",
	baseQuery: baseQuery,
	tagTypes: ["Address"],
	endpoints: (builder) => ({
		createAddress: builder.mutation<AddressResponse, CreateAddressRequest>({
			query: (addressData) => ({
				url: `/api/users/${addressData.userId}/addresses`,
				method: "POST",
				body: addressData,
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "Address", id: "CURRENT" },
				{ type: "Address", id: userId },
			],
		}),

		updateAddress: builder.mutation<AddressResponse, UpdateAddressRequest>({
			query: (addressData) => ({
				url: `/api/users/${addressData.userId}/addresses/${addressData.addressId}`,
				method: "PUT",
				body: addressData.data,
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "Address", id: "CURRENT" },
				{ type: "Address", id: userId },
			],
		}),

		deleteAddress: builder.mutation<DeleteAddressResponse, DeleteAddressRequest>({
			query: ({ userId, addressId }) => ({
				url: `/api/users/${userId}/addresses/${addressId}`,
				method: "DELETE",
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "Address", id: "CURRENT" },
				{ type: "Address", id: userId },
			],
		}),

		getUserAddresses: builder.query<AddressesResponse, number>({
			query: (userId) => ({
				url: `/api/users/${userId}/addresses`,
				method: "GET",
			}),
			providesTags: (result) => [
				{ type: "Address", id: "LIST" },
				...(result?.data?.data?.map(({ identifier }) => ({
					type: "Address" as const,
					id: identifier,
				})) || []),
			],
		}),
	}),
});

export const {
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useGetUserAddressesQuery,
} = addressApi;
