import { Address, User } from "@/features/auth/types";
import { ProductImage } from "@/features/products/types";

export interface Order {
	identifier: number;
	orderNumber: string;
	totalAmount: number;
	paymentMethod: string;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	customer: User;
	items: OrderItem[];
	address: Address;
	coupon: Coupon;
	createdDate: string;
	lastChange: string;
}

export interface OrderItem {
	identifier: number;
	quantity: number;
	total_price: number;
	amount_discount_price: number;
	orderable_type: string;
	orderable:
		| {
				identifier: number;
				en: {
					title: string;
					details: string;
				};
				ar: {
					title: string;
					details: string;
				};
				sku: string;
				color: string;
				images: ProductImage[];
				variant: string;
				price: number;
				discount_price: number;
				createdDate: string;
				lastChange: string;
		  }
		| {
				identifier: number;
				picture: string;
				productsTotalPrice: string;
				offerPrice: string;
				startDate: string;
				endDate: string;
				en: {
					title: string;
					details: string;
				};
				ar: {
					title: string;
					details: string;
				};
				createdDate: string;
				lastChange: string;
		  };
	is_reviewed: boolean;
	createdDate: string;
	lastChange: string;
}

export interface Coupon {
	id: number;
	code: string;
	name: string;
	discount_type: "fixed" | "percentage";
	discount_amount: number;
	usage_limit: number;
	usage_limit_per_user: number;
	start_date: string;
	end_date: string;
	status: "active" | "inactive";
	createdDate: string;
	lastChange: string;
}

export interface OrderRequest {
	userId: number;
	couponId?: number;
	addressId: number;
	paymentMethod: "cash_on_delivery" | "credit_card";
	items: Array<
		| {
				colorId: number;
				variantId: number;
				quantity: number;
				orderable_type: string;
				orderableId: number;
		  }
		| {
				quantity: number;
				orderable_type: string;
				orderableId: number;
		  }
	>;
}

export interface OrderResponse {
	data: Order;
	message: string;
	status: string;
}

export interface CouponRequest {
	code: string;
	userId: number;
}

export interface CouponResponse {
	data: Coupon;
	message: string;
	status: string;
}

export interface PaymentFormData {
	creditCardNumber: string;
	creditCardExpirationDate: string;
	creditCardCvv: string;
	creditCardName: string;
}
