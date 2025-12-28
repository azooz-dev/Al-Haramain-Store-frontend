import { createApi } from "@reduxjs/toolkit/query/react";
import {
	CreateAddressRequest,
	AddressResponse,
	UpdateAddressRequest,
	DeleteAddressRequest,
	DeleteAddressResponse,
	AddressesResponse,
} from "../types";
import { extractErrorMessage } from "../utils/extractErrorMessage";
import { RequestFailure } from "../types";
import { baseQueryWithReauth } from "@/shared/api/baseQuery";

export const addressApi = createApi({
	reducerPath: "addressesApi",
	baseQuery: baseQueryWithReauth,
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
