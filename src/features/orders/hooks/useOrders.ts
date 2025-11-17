import { useCallback } from "react";
import { useCreateOrderMutation, useLazyGetCouponQuery } from "../services/ordersApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { OrderRequest, OrderResponse } from "../types";

export const useOrders = () => {
	const { currentUser } = useAuth();
	const [createOrderMutation, { isLoading: isCreatingOrder, error: createOrderError }] =
		useCreateOrderMutation();

	// Use lazy query hook which gives us a trigger function
	const [triggerGetCoupon, { data: couponData, isLoading: isLoadingCoupon, error: couponError }] =
		useLazyGetCouponQuery();

	const createOrder = useCallback(
		async (orderData: OrderRequest): Promise<OrderResponse> => {
			const response = await createOrderMutation(orderData).unwrap();
			return response;
		},
		[createOrderMutation]
	);

	const getCoupon = useCallback(
		async (code: string) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			// Trigger the query and wait for the result
			const result = await triggerGetCoupon({
				code,
				userId: currentUser.identifier,
			});

			return result.data;
		},
		[currentUser?.identifier, triggerGetCoupon]
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
