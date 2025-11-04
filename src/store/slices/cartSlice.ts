import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/features/cart/types";

interface CartState {
	items: CartItem[];
	totalItems: number;
	totalPrice: number;
	discountAmount: number;
	discountType: "fixed" | "percentage";
	isLoading: boolean;
	error: string | null;
}

const initialState: CartState = {
	items: [],
	totalItems: 0,
	totalPrice: 0,
	discountAmount: 0,
	discountType: "fixed",
	isLoading: false,
	error: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<CartItem>) => {
			const existingItem = state.items.find(
				(item) => item.identifier === action.payload.identifier
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}
			cartSlice.caseReducers.calculateTotals(state);
		},

		removeFromCart: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter((item) => item.identifier !== action.payload);
			cartSlice.caseReducers.calculateTotals(state);
		},

		updateQuantity: (state, action: PayloadAction<{ identifier: number; quantity: number }>) => {
			const { identifier, quantity } = action.payload;
			const item = state.items.find((item) => item.identifier === identifier);

			if (item) {
				if (quantity <= 0) {
					cartSlice.actions.removeFromCart(identifier);
				} else {
					item.quantity = quantity;
				}
				cartSlice.caseReducers.calculateTotals(state);
			}
		},

		setDiscount: (
			state,
			action: PayloadAction<{ amount: number; type: "fixed" | "percentage" }>
		) => {
			state.discountAmount = action.payload.amount;
			state.discountType = action.payload.type;
		},

		calculateTotals: (state) => {
			state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
			state.totalPrice = state.items.reduce<number>((total, item) => {
				const price =
					item.orderable === "product" ? item.amount_discount_price || item.price : item.price;
				return total + price * item.quantity;
			}, 0);
		},

		setCartLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		setCartError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},

		loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
			state.items = action.payload;
			cartSlice.caseReducers.calculateTotals(state);
		},

		clearCart: (state) => {
			state.items = [];
			state.totalItems = 0;
			state.totalPrice = 0;
			state.isLoading = false;
			state.error = null;
		},
	},
});

export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	calculateTotals,
	setCartLoading,
	setCartError,
	loadCartFromStorage,
	clearCart,
	setDiscount,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }) => state.cart.totalItems;
export const selectCartTotalPrice = (state: { cart: CartState }) => state.cart.totalPrice;
export const selectCartIsLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartDiscountAmount = (state: { cart: CartState }) => state.cart.discountAmount;
export const selectCartDiscountType = (state: { cart: CartState }) => state.cart.discountType;
export const selectCartItemById = (state: { cart: CartState }, identifier: number) =>
	state.cart.items.find((item) => item.identifier === identifier);

export default cartSlice.reducer;
