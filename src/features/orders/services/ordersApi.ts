import { createApi } from "@reduxjs/toolkit/query/react";
import { RequestFailure } from "@/shared/types";
import { CouponRequest, CouponResponse, OrderRequest, OrderResponse } from "../types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { baseQueryWithReauth } from "@/shared/api/baseQuery";

export const ordersApi = createApi({
	reducerPath: "ordersApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Orders", "Coupon"],
	endpoints: (builder) => ({
		createOrder: builder.mutation<OrderResponse, OrderRequest>({
			query: (orderData) => ({
				url: "/api/orders",
				method: "POST",
				body: orderData,
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: ["Orders"],
		}),

		getCoupon: builder.query<CouponResponse, CouponRequest>({
			query: (couponData) => ({
				url: `/api/coupons/${couponData.code}/${couponData.userId}`,
				method: "GET",
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			providesTags: (_result, _error, { code, userId }) => [
				{ type: "Coupon" as const, id: `${code}-${userId}` },
			],
		}),
	}),
});

export const { useCreateOrderMutation, useGetCouponQuery, useLazyGetCouponQuery } = ordersApi;

export const { createOrder, getCoupon } = ordersApi.endpoints;
