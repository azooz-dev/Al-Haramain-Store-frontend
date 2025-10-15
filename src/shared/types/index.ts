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

export interface RequestFailure {
	status: number;
	data: {
		message: string | { [key: string]: string[] };
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
