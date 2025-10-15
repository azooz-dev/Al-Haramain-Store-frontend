import { Product } from "@/features/products/types";

export interface Offer {
	identifier: number;
	picture: string;
	productsTotalPrice: string;
	offerPrice: string;
	startDate: string;
	endDate: string;
	products: Product[];
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
}
