import { Product } from "@/features/products/types";
import { Link } from "@/shared/types";

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

export interface OffersResponse {
	data: {
		current_Page: number;
		data: Offer[];
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		links: Link[];
		next_page_url: string | null;
		path: string;
		per_page: number;
		prev_page_url: string | null;
		to: number;
		total: number;
	};
	message: string;
	status: string;
}

export interface OfferResponse {
	data: Offer;
	message: string;
	status: string;
}

export interface OfferRequest {
	page?: number;
	per_page?: number;
}

export interface TimeRemaining {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	expired: boolean;
}
