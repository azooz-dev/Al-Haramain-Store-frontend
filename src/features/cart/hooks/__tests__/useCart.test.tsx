/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useCart } from "../useCart";
import cartReducer from "@/store/slices/cartSlice";
import { CartItem } from "../../types";
import React from "react";

// Mock cart item factory
const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  identifier: 1,
  en: { title: "Test Product", details: "Test description" },
  ar: { title: "منتج تجريبي", details: "وصف تجريبي" },
  quantity: 1,
  price: 100,
  amount_discount_price: 80,
  image: "/test.jpg",
  orderable: "product",
  ...overrides,
});

// Create test store
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState,
  });

// Wrapper component
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
};

describe("useCart", () => {
  describe("initial state", () => {
    it("should return empty cart by default", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.cartItems).toEqual([]);
      expect(result.current.isEmpty).toBe(true);
      expect(result.current.hasItems).toBe(false);
    });
  });

  describe("handleAddToCart", () => {
    it("should add item to cart", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      const item = createMockCartItem();
      act(() => {
        result.current.handleAddToCart(item);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.hasItems).toBe(true);
    });

    it("should return true on successful add", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      let success: boolean;
      act(() => {
        success = result.current.handleAddToCart(createMockCartItem());
      });

      expect(success!).toBe(true);
    });
  });

  describe("handleUpdateQuantity", () => {
    it("should update item quantity", () => {
      const store = createTestStore({
        cart: {
          items: [createMockCartItem()],
          totalItems: 1,
          totalPrice: 80,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleUpdateQuantity(1, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });
  });

  describe("handleRemoveItem", () => {
    it("should remove item from cart", () => {
      const store = createTestStore({
        cart: {
          items: [createMockCartItem()],
          totalItems: 1,
          totalPrice: 80,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleRemoveItem(1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe("handleClearCart", () => {
    it("should clear all items from cart", () => {
      const store = createTestStore({
        cart: {
          items: [createMockCartItem({ identifier: 1 }), createMockCartItem({ identifier: 2 })],
          totalItems: 2,
          totalPrice: 160,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleClearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe("helper functions", () => {
    const setupStoreWithItems = () =>
      createTestStore({
        cart: {
          items: [createMockCartItem({ identifier: 1, quantity: 3 })],
          totalItems: 3,
          totalPrice: 240,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });

    it("isInCart should return true for existing item", () => {
      const store = setupStoreWithItems();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isInCart(1)).toBe(true);
      expect(result.current.isInCart(999)).toBe(false);
    });

    it("getCartItem should return item by identifier", () => {
      const store = setupStoreWithItems();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      const item = result.current.getCartItem(1);
      expect(item).toBeDefined();
      expect(item?.identifier).toBe(1);
    });

    it("getProductCartItemQuantity should return quantity", () => {
      const store = setupStoreWithItems();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.getProductCartItemQuantity(1)).toBe(3);
      expect(result.current.getProductCartItemQuantity(999)).toBe(0);
    });
  });

  describe("cartSummary", () => {
    it("should provide correct summary", () => {
      const store = createTestStore({
        cart: {
          items: [createMockCartItem({ identifier: 1 }), createMockCartItem({ identifier: 2 })],
          totalItems: 2,
          totalPrice: 160,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.cartSummary.itemsCount).toBe(2);
      expect(result.current.cartSummary.isEmpty).toBe(false);
      expect(result.current.cartSummary.hasItems).toBe(true);
    });
  });

  describe("cartCalculations", () => {
    it("should calculate subtotal correctly", () => {
      const store = createTestStore({
        cart: {
          items: [
            createMockCartItem({ identifier: 1, quantity: 2, amount_discount_price: 50 }),
            createMockCartItem({ identifier: 2, quantity: 1, amount_discount_price: 30 }),
          ],
          totalItems: 3,
          totalPrice: 130,
          discountAmount: 0,
          discountType: "fixed",
          isLoading: false,
          error: null,
        },
      });
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.cartCalculations.subtotal).toBe(130); // (50*2) + (30*1)
    });
  });

  describe("handleSetDiscount", () => {
    it("should set discount", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleSetDiscount(20, "fixed");
      });

      expect(result.current.discountAmount).toBe(20);
      expect(result.current.discountType).toBe("fixed");
    });
  });
});
