import { persistReducer, persistStore, createTransform, PersistConfig } from "redux-persist";
import { configureStore, combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
// Import slices
import uiSlice from "./slices/uiSlice";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
import offersSlice from "./slices/offersSlice";
import productsSlice from "./slices/productSlice";
import favoritesSlice from "./slices/favoritesSlice";
import categoriesSlice from "./slices/categoriesSlice";
import { authApi } from "@/features/auth/services/authApi";
import { productApi } from "@/features/products/services/productApi";
import { categoryApi } from "@/features/categories/services/categoryApi";
import { favoriteApi } from "@/features/favorites/services/favoriteApi";
import { offersApi } from "@/features/offers/services/offerApi";
import { ordersApi } from "@/features/orders/services/ordersApi";
import { addressApi } from "@/shared/services/addressesApi";
import { usersApi } from "@/features/user/services/usersApi";
import { stripeApi } from "@/features/payments/services/stripeApi";

const authTransform = createTransform<unknown, unknown>(
	// Transform state being saved to storage (outbound) - save as-is
	(inboundState) => inboundState,
	// Transform state being rehydrated from storage (inbound)
	(outboundState) => {
		if (!outboundState) return outboundState;
		return {
			...(outboundState as object),
			isLoading: false,
			error: null,
		};
	},
	// Only apply to auth slice
	{ whitelist: ["auth"] }
);

const rootReducer = combineReducers({
	// Slices
	auth: authSlice,
	cart: cartSlice,
	favorites: favoritesSlice,
	products: productsSlice,
	categories: categoriesSlice,
	ui: uiSlice,
	user: userSlice,
	offers: offersSlice,

	// API reducers
	[authApi.reducerPath]: authApi.reducer,
	[productApi.reducerPath]: productApi.reducer,
	[favoriteApi.reducerPath]: favoriteApi.reducer,
	[offersApi.reducerPath]: offersApi.reducer,
	[categoryApi.reducerPath]: categoryApi.reducer,
	[addressApi.reducerPath]: addressApi.reducer,
	[ordersApi.reducerPath]: ordersApi.reducer,
	[stripeApi.reducerPath]: stripeApi.reducer,
	[usersApi.reducerPath]: usersApi.reducer,
});

// Extract root state type from the non-persisted reducer
type RootReducerState = ReturnType<typeof rootReducer>;

// Type the persist config properly
const persistConfig: PersistConfig<RootReducerState> = {
	key: "root",
	storage,
	whitelist: ["auth", "cart", "favorites", "ui"],
	transforms: [authTransform],
};

// Create the persisted reducer with proper typing
const persistedReducer = persistReducer(persistConfig, rootReducer) as unknown as Reducer<
	RootReducerState,
	UnknownAction
>;

// Configure store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		})
			.concat(authApi.middleware)
			.concat(productApi.middleware)
			.concat(favoriteApi.middleware)
			.concat(categoryApi.middleware)
			.concat(ordersApi.middleware)
			.concat(addressApi.middleware)
			.concat(offersApi.middleware)
			.concat(usersApi.middleware)
			.concat(stripeApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
