import { persistReducer, persistStore } from 'redux-persist';
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
// Import slices
import uiSlice from './slices/uiSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';
import offersSlice from './slices/offersSlice';
import productsSlice from './slices/productSlice';
import favoritesSlice from './slices/favoritesSlice';
import categoriesSlice from './slices/categoriesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whiteList: ['auth', 'cart', 'favorites', 'ui'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  favorites: favoritesSlice,
  products: productsSlice,
  categories: categoriesSlice,
  ui: uiSlice,
  user: userSlice,
  offersSlice,
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
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;