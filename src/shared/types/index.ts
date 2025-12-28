export type PageType =
	| "home"
	| "products"
	| "product-details"
	| "about"
	| "contact"
	| "cart"
	| "checkout"
	| "signin"
	| "signup"
	| "dashboard"
	| "dashboard-orders"
	| "dashboard-settings"
	| "favorites";

export type DashboardTab = "profile" | "orders" | "reviews" | "favorites" | "settings";

export interface NavigationParams {
	page: PageType;
	productId?: string;
	dashboardTab?: DashboardTab;
}

// Recursive type for nested validation errors (e.g., { user: { profile: { name: string[] } } })
export type ValidationErrors =
	| string[]
	| { [key: string]: ValidationErrors };

export interface RequestFailure {
	status: number;
	data: {
		message: string | ValidationErrors;
		status: string;
	};
}

export interface ProcessedError {
	data: {
		message: string;
		status: "error";
	};
}

export interface Link {
	url: string | null;
	label: string;
	page: number | null;
	active: boolean;
}

export interface PaginationData {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
}

export interface AddressFormData {
	label: string;
	addressType: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	isDefault: boolean;
}

export interface CreateAddressRequest extends AddressFormData {
	userId: number;
}
export interface UpdateAddressRequest {
	userId: number;
	addressId: number;
	data: Partial<AddressFormData>;
}

export interface Address {
	identifier: number;
	addressType: string;
	label: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	isDefault: boolean;
	createdDate: string;
	lastChange: string;
}

export interface AddressResponse {
	data: Address;
	message: string;
	status: string;
}

export interface AddressesResponse {
	data: {
		data: Address[];
		current_page: number;
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

export interface DeleteAddressRequest {
	addressId: number;
	userId: number;
}

export interface DeleteAddressResponse {
	message: string;
	status: string;
}

export interface NavigationItem {
	key: string;
	path: string;
	label: string;
}
