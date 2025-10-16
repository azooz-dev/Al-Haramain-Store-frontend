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
	quantity: number;
	price: number;
	amount_discount_price: number;
	image: string;
	orderable: "product" | "offer";
}
