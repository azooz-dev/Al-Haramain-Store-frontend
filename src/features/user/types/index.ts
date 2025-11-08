import { User } from "@/features/auth/types";
import { Order, OrderItem } from "@/features/orders/types";

export interface UpdateUserRequest {
	userId: number;
	data: Partial<User>;
}

export interface UpdateUserResponse {
	data: User;
	message: string;
	status: string;
}

export interface DeleteUserRequest {
	userId: number;
}

export interface DeleteUserResponse {
	message: string;
	status: string;
}

export interface GetUserOrdersRequest {
	userId: number;
}

export interface UserOrdersResponse {
	data: { data: Order[]; total: number; perPage: number; currentPage: number; lastPage: number };
	message: string;
	status: string;
}

export interface CreateReviewRequest {
	userId: number;
	orderId: number;
	itemId: number;
	rating: number;
	comment: string;
}

export interface CreateReviewResponse {
	data: {
		identifier: string;
		rating: number;
		locale: "en" | "ar";
		comment: string;
		status: "pending" | "approved" | "rejected";
		item: OrderItem;
		createdDate: string;
		lastChange: string;
	};
	message: string;
	status: string;
}
