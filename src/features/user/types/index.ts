import { User } from "@/features/auth/types";
import { Order } from "@/features/orders/types";

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
