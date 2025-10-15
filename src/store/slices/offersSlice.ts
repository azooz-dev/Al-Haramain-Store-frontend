import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Offer } from "@/features/offers/types";
import { ProcessedError } from "@/shared/types";
import { PaginationData } from "@/shared/types";

interface OffersState {
	offers: Offer[];
	isLoading: boolean;
	error: string | null;
	// Pagination
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	totalItems: number;
	perPage: number;
}

const initialState: OffersState = {
	offers: [],
	isLoading: false,
	error: null,
	currentPage: 1,
	itemsPerPage: 6,
	totalPages: 1,
	totalItems: 1,
	perPage: 6,
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

		setOffersError: (state, action: PayloadAction<ProcessedError>) => {
			state.error = action.payload.data.message;
		},

		setOffersLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		clearOffers: (state) => {
			state.offers = [];
		},

		setPaginationData: (state, action: PayloadAction<PaginationData>) => {
			state.currentPage = action.payload.currentPage;
			state.totalPages = action.payload.totalPages;
			state.totalItems = action.payload.totalItems;
			state.perPage = action.payload.perPage;
		},

		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},

		setItemsPerPage: (state, action: PayloadAction<number>) => {
			state.itemsPerPage = action.payload;
		},
	},
});

export const {
	setOffers,
	setOffersError,
	setOffersLoading,
	clearOffers,
	setPaginationData,
	setCurrentPage,
	setItemsPerPage,
} = offersSlice.actions;

// Selectors
export const selectOffers = (state: { offers: OffersState }) => state.offers;
export const selectOffersLoading = (state: { offers: OffersState }) => state.offers.isLoading;
export const selectOffersError = (state: { offers: OffersState }) => state.offers.error;
export const selectOfferById = (id: number) => (state: { offers: OffersState }) =>
	state.offers.offers.find((offer) => offer.identifier === id);

export default offersSlice.reducer;
