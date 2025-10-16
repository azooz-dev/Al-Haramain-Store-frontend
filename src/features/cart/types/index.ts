export interface CartItem {
	identifier: number;
	en: {
		title: string;
		details: string;
	};
	ar: {
		title: string;
		details: string;
	};
	color: {
		id: number;
		color_code: string;
	};
	variant: {
		id: number;
		size: string;
	};
	quantity: number;
	price: number;
	amount_discount_price: number;
	image: string;
	orderable: "product" | "offer";
}
