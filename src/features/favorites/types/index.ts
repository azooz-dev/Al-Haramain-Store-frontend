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
