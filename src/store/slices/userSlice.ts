import { User } from "@/features/auth/types";
import { Order } from "@/features/orders/types";
import { Address } from "@/shared/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	profile: User | null;
	addresses: Address[];
	orders: Order[];
	isLoading: boolean;
	error: string | null;
}

const initialState: UserState = {
	profile: null,
	addresses: [],
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
			const updatedUser =
				state.profile?.identifier === action.payload.identifier ? action.payload : null;
			if (updatedUser) {
				state.profile = updatedUser;
			}
		},

		setAddresses: (state, action: PayloadAction<Address[]>) => {
			state.addresses = action.payload;
		},

		addAddress: (state, action: PayloadAction<Address>) => {
			state.addresses.push(action.payload);
		},

		updateAddress: (state, action: PayloadAction<Address>) => {
			state.addresses = state.addresses.map((address) =>
				address.identifier === action.payload.identifier ? action.payload : address
			);
		},

		removeAddress: (state, action: PayloadAction<number>) => {
			state.addresses = state.addresses.filter((address) => address.identifier !== action.payload);
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

		deleteUserAction: (state) => {
			state.profile = null;
			state.addresses = [];
			state.orders = [];
			state.isLoading = false;
			state.error = null;
		},
	},
});

export const {
	setProfile,
	updateProfile,
	setAddresses,
	addAddress,
	updateAddress,
	removeAddress,
	setOrders,
	addOrder,
	setUserLoading,
	setUserError,
	deleteUserAction,
} = userSlice.actions;

export const selectProfile = (state: { user: UserState }) => state.user.profile;
export const selectAddresses = (state: { user: UserState }) => state.user.addresses;
export const selectOrders = (state: { user: UserState }) => state.user.orders;
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
