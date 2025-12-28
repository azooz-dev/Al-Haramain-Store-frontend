import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import slices
import authSlice from "@/store/slices/authSlice";
import cartSlice from "@/store/slices/cartSlice";
import uiSlice from "@/store/slices/uiSlice";
import favoritesSlice from "@/store/slices/favoritesSlice";
import productsSlice from "@/store/slices/productSlice";
import categoriesSlice from "@/store/slices/categoriesSlice";
import offersSlice from "@/store/slices/offersSlice";
import userSlice from "@/store/slices/userSlice";

// Import APIs
import { authApi } from "@/features/auth/services/authApi";
import { productApi } from "@/features/products/services/productApi";
import { categoryApi } from "@/features/categories/services/categoryApi";
import { favoriteApi } from "@/features/favorites/services/favoriteApi";
import { offersApi } from "@/features/offers/services/offerApi";
import { ordersApi } from "@/features/orders/services/ordersApi";
import { addressApi } from "@/shared/services/addressesApi";
import { usersApi } from "@/features/user/services/usersApi";
import { stripeApi } from "@/features/payments/services/stripeApi";

// Create root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  favorites: favoritesSlice,
  products: productsSlice,
  categories: categoriesSlice,
  ui: uiSlice,
  user: userSlice,
  offers: offersSlice,
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

export type RootState = ReturnType<typeof rootReducer>;

// Create a test store with optional preloaded state
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
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
}

type AppStore = ReturnType<typeof setupStore>;

// Extended render options
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  route?: string;
}

/**
 * Custom render function that wraps components with Redux Provider and MemoryRouter
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {} as Partial<RootState>,
    store = setupStore(preloadedState),
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Export custom render as default
export { renderWithProviders as render };
