import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";
import { getCookieValue } from "@/shared/utils/getCookieValue";
import { APP_CONFIG } from "@/shared/config/config";
import { RequestFailure } from "@/shared/types";
import { CouponRequest, CouponResponse, OrderRequest, OrderResponse } from "../types";

const rawBaseQuery = fetchBaseQuery({
	baseUrl: APP_CONFIG.apiBaseUrl,
	credentials: "include",
	validateStatus: (response) => response.status >= 200 && response.status < 300,
	prepareHeaders: (headers) => {
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

const baseQueryWithLocale: typeof rawBaseQuery = async (args, api, extra) => {
	const language = (api.getState() as RootState)?.ui?.language || "en";

	if (typeof args === "string") args = { url: args };
	if (typeof args === "object") {
		(args.headers = new Headers(args.headers as HeadersInit)).set("X-locale", language);
	}

	const result = await rawBaseQuery(args, api, extra);

	if (result.error) {
		const error = result.error as RequestFailure;
		if (error.data && typeof error.data === "object") {
			result.error = {
				status: error.status || 500,
				data: {
					message: error.data.message || "An error occurred",
					status: error.data.status || "error",
				},
			};
		}
	}
	return result;
};

export const ordersApi = createApi({
	reducerPath: "ordersApi",
	baseQuery: baseQueryWithLocale,
	tagTypes: ["Orders", "Coupon"],
	endpoints: (builder) => ({
		createOrder: builder.mutation<OrderResponse, OrderRequest>({
			query: (orderData) => ({
				url: "/api/orders",
				method: "POST",
				body: orderData,
			}),
			invalidatesTags: ["Orders"],
		}),

		getCoupon: builder.query<CouponResponse, CouponRequest>({
			query: (couponData) => ({
				url: `/api/coupons/${couponData.code}/${couponData.userId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, { code, userId }) => [
				{ type: "Coupon" as const, id: `${code}-${userId}` },
			],
		}),
	}),
});

export const { useCreateOrderMutation, useGetCouponQuery } = ordersApi;

export const { createOrder, getCoupon } = ordersApi.endpoints;
