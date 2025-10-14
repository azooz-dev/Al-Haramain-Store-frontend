import { persistReducer, persistStore } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
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

const persistConfig = {
	key: "root",
	storage,
	whiteList: ["auth", "cart", "favorites", "ui"],
};

const rootReducer = combineReducers({
	// Slices
	auth: authSlice,
	cart: cartSlice,
	favorites: favoritesSlice,
	products: productsSlice,
	categories: categoriesSlice,
	ui: uiSlice,
	user: userSlice,
	offersSlice,

	// API reducers
	[authApi.reducerPath]: authApi.reducer,
	[productApi.reducerPath]: productApi.reducer,
	[categoryApi.reducerPath]: categoryApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

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
			.concat(categoryApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
