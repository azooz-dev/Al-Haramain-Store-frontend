export interface Product {
	identifier: number;
	slug: string;
	sku: string;
	stock: number;
	en: {
		title: string;
		details: string;
	};
	ar: {
		title: string;
		details: string;
	};
	colors: ProductColor[];
	reviews: Review[];
	categories: number[];
	min_price: number;
	max_price: number;
	price_range: string;
	createdDate: string;
	lastChange: string;
	total_images_count: number;
	available_sizes: string[];
	available_colors: string[];
}

export interface TransformedProduct extends Product {
	price: number;
	amount_discount_price: number;
	image: string;
	rating: number;
	reviewCount: number;
	isNew: boolean;
	discount: number;
	firstColorId?: number;
	firstVariantId?: number;
}

export interface ProductColor {
	id: number;
	color_code: string;
	images: ProductImage[];
	variants: ProductVariant[];
}

export interface ProductVariant {
	id: number;
	size: string;
	price: number;
	amount_discount_price: string;
	quantity: number;
}

export interface ProductImage {
	id: number;
	image_url: string;
	alt_text: string;
}

export interface Review {
	id: number;
	order_id: number;
	user_id: number;
	product_id: number;
	rating: string;
	comment: string;
	locale: "en" | "ar";
	status: "pending" | "approved" | "rejected";
	createdDate: string;
	lastChange: string;
}

export interface PaginationData {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
}

export interface ProductRequest {
	page?: number;
	per_page?: number;
}

export interface ProductsResponse {
	data: {
		data: Product[];
		current_page: number;
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		links: Array<Link>;
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

export interface ProductResponse {
	data: Product;
	message: string;
	status: string;
}

export interface Link {
	url: string | null;
	label: string;
	page: number | null;
	active: boolean;
}
