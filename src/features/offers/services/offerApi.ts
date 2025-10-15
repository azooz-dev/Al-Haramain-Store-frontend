import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OffersResponse, OfferResponse, OfferRequest } from "../types";
import { APP_CONFIG } from "@/shared/config/config";

export const offersApi = createApi({
	reducerPath: "offersApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${APP_CONFIG.apiBaseUrl}/api`,
	}),
	tagTypes: ["Offers"],
	endpoints: (builder) => ({
		getOffers: builder.query<OffersResponse, OfferRequest>({
			query: (params) => ({
				url: "/offers",
				params: params,
			}),
			providesTags: ["Offers"],
		}),

		getOfferById: builder.query<OfferResponse, number>({
			query: (offerId) => `/offers/${offerId}`,
			keepUnusedDataFor: 600,
			providesTags: (_, __, id) => [{ type: "Offers", id: id }],
		}),
	}),
});

export const { useGetOffersQuery, useGetOfferByIdQuery } = offersApi;
