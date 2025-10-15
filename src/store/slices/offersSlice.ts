import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Offer } from "@/features/offers/types";

interface OffersState {
	offers: Offer[];
	isLoading: boolean;
	error: string | null;
}

const initialState: OffersState = {
	offers: [],
	isLoading: false,
	error: null,
};

const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {
		setOffers: (state, action: PayloadAction<Offer[]>) => {
			state.isLoading = false;
			state.error = null;
			state.offers = action.payload;
		},

		setOffersError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},

		setOffersLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		clearOffers: (state) => {
			state.offers = [];
		},
	},
});

export const { setOffers, setOffersError, setOffersLoading, clearOffers } = offersSlice.actions;

// Selectors
export const selectOffers = (state: { offers: OffersState }) => state.offers.offers;
export const selectOffersLoading = (state: { offers: OffersState }) => state.offers.isLoading;
export const selectOffersError = (state: { offers: OffersState }) => state.offers.error;
export const selectOfferById = (id: number) => (state: { offers: OffersState }) =>
	state.offers.offers.find((offer) => offer.identifier === id);

export default offersSlice.reducer;
