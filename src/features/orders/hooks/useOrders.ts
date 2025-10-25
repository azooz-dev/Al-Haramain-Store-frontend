import { useCallback, useState } from "react";
import { useCreateOrderMutation, useGetCouponQuery } from "../services/ordersApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { OrderRequest, CouponRequest } from "../types";

export const useOrders = () => {
	const { currentUser } = useAuth();
	const [createOrderMutation, { isLoading: isCreatingOrder, error: createOrderError }] =
		useCreateOrderMutation();

	// State to control when to fetch coupon
	const [couponParams, setCouponParams] = useState<CouponRequest | null>(null);

	// Use the query hook at the top level
	const {
		data: couponData,
		isLoading: isLoadingCoupon,
		error: couponError,
		refetch: refetchCoupon,
	} = useGetCouponQuery(couponParams!, {
		skip: !couponParams, // Skip the query if no params are set
	});

	const createOrder = useCallback(
		async (orderData: OrderRequest) => {
			const response = await createOrderMutation(orderData).unwrap();
			return response.data;
		},
		[createOrderMutation]
	);

	const getCoupon = useCallback(
		async (code: string) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			// Set the parameters to trigger the query
			setCouponParams({
				code,
				userId: currentUser.identifier,
			});

			// Wait for the query to complete
			const result = await refetchCoupon();
			return result.data;
		},
		[currentUser?.identifier, refetchCoupon]
	);

	return {
		createOrder,
		getCoupon,
		isCreatingOrder,
		createOrderError,
		isLoadingCoupon,
		couponError,
		couponData,
	};
};
