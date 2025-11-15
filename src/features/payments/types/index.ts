import { OrderRequest } from "@/features/orders/types";

export interface CreatePaymentIntentRequest extends OrderRequest {
	amount: number;
	currency?: string;
	totalAmount: number;
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
