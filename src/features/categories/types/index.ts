export interface CategoryTranslation {
	title: string;
	details: string;
}

export interface Category {
	identifier: number;
	slug: string;
	en: CategoryTranslation;
	ar: CategoryTranslation;
	createdDate: string;
	lastChange: string;
}

export interface CategoriesResponse {
	data: {
		data: Category[];
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

export interface CategoryResponse {
	data: Category;
	message: string;
	status: string;
}

export interface Link {
	url: string | null;
	label: string;
	page: number | null;
	active: boolean;
}
