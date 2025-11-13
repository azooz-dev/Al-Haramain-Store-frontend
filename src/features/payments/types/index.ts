import { OrderItemRequest } from "@/features/orders/types";

export interface CreatePaymentIntentRequest {
	amount: number;
	currency?: string;
	user_id: number;
	items: OrderItemRequest[];
	coupon_code?: string;
	address_id: number;
	total_amount: number;
	payment_method: "cash_on_delivery" | "credit_card";
}

export interface CreatePaymentIntentResponse {
	data: {
		client_secret: string;
	};
	message: string;
	status: string;
}

export interface StripePaymentError {
	type: string;
	code?: string;
	message: string;
	decline_code?: string;
}
