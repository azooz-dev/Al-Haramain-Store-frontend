import { User } from "@/features/auth/types";
import { Order } from "@/features/orders/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	profile: User | null;
	orders: Order[];
	isLoading: boolean;
	error: string | null;
}

const initialState: UserState = {
	profile: null,
	orders: [],
	isLoading: false,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setProfile: (state, action: PayloadAction<User>) => {
			state.profile = action.payload;
		},

		updateProfile: (state, action: PayloadAction<User>) => {
			state.profile = { ...state.profile, ...action.payload };
		},

		setOrders: (state, action: PayloadAction<Order[]>) => {
			state.orders = action.payload;
		},

		addOrder: (state, action: PayloadAction<Order>) => {
			state.orders.push(action.payload);
		},

		setUserLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		setUserError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setProfile, updateProfile, setOrders, addOrder, setUserLoading, setUserError } =
	userSlice.actions;

export const selectProfile = (state: { user: UserState }) => state.user.profile;
export const selectOrders = (state: { user: UserState }) => state.user.orders;
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
