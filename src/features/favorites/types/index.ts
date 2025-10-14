import { User } from "@/features/auth/types";
import { ProductColor, ProductVariant } from "@/features/products/types";

export interface Favorite {
	identifier: number;
	user: User;
	product: {
		identifier: number;
		slug: string;
		en: {
			title: string;
			details: string;
		};
		ar: {
			title: string;
			details: string;
		};
		color: ProductColor;
		image: string | null;
		variant: ProductVariant;
	};
	createdDate: string;
	lastChange: string;
}

export interface FavoritesAddRequest {
	userId: number;
	productId: number;
	colorId: number;
	variantId: number;
}

export interface FavoritesResponse {
	data: {
		data: Favorite[];
	};
	message: string;
	status: string;
}

export interface FavoritesRemoveRequest {
	userId: number;
	favoriteId: number;
}

export interface FavoritesRemoveResponse {
	message: string;
	status: string;
}

export interface FavoriteAddResponse {
	data: Favorite;
	message: string;
	status: string;
}
