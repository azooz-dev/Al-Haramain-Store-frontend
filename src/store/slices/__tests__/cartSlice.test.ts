import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setDiscount,
  setCartLoading,
  setCartError,
  loadCartFromStorage,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartIsLoading,
  selectCartError,
} from "../cartSlice";
import { CartItem } from "@/features/cart/types";

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

describe("cartSlice", () => {
  const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    discountAmount: 0,
    discountType: "fixed" as const,
    isLoading: false,
    error: null,
  };

  describe("addToCart", () => {
    it("should add new item to empty cart", () => {
      const item = createMockCartItem();

      const state = cartReducer(initialState, addToCart(item));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(item);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(80); // Uses discount price for product
    });

    it("should increase quantity for existing item", () => {
      const item = createMockCartItem();
      const stateWithItem = {
        ...initialState,
        items: [item],
        totalItems: 1,
        totalPrice: 80,
      };

      const state = cartReducer(stateWithItem, addToCart(createMockCartItem({ quantity: 2 })));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3); // 1 + 2
      expect(state.totalItems).toBe(3);
    });

    it("should add different items separately", () => {
      const item1 = createMockCartItem({ identifier: 1 });
      const item2 = createMockCartItem({ identifier: 2 });
      const stateWithItem1 = cartReducer(initialState, addToCart(item1));

      const state = cartReducer(stateWithItem1, addToCart(item2));

      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(2);
    });
  });

  describe("removeFromCart", () => {
    it("should remove item by identifier", () => {
      const item = createMockCartItem();
      const stateWithItem = {
        ...initialState,
        items: [item],
        totalItems: 1,
        totalPrice: 80,
      };

      const state = cartReducer(stateWithItem, removeFromCart(1));

      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it("should not affect other items", () => {
      const item1 = createMockCartItem({ identifier: 1 });
      const item2 = createMockCartItem({ identifier: 2 });
      const stateWithItems = {
        ...initialState,
        items: [item1, item2],
        totalItems: 2,
      };

      const state = cartReducer(stateWithItems, removeFromCart(1));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].identifier).toBe(2);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const item = createMockCartItem();
      const stateWithItem = {
        ...initialState,
        items: [item],
      };

      const state = cartReducer(stateWithItem, updateQuantity({ identifier: 1, quantity: 5 }));

      expect(state.items[0].quantity).toBe(5);
      expect(state.totalItems).toBe(5);
    });

    it("should recalculate totals after quantity update", () => {
      const item = createMockCartItem({ price: 100, amount_discount_price: 50 });
      const stateWithItem = {
        ...initialState,
        items: [item],
      };

      const state = cartReducer(stateWithItem, updateQuantity({ identifier: 1, quantity: 3 }));

      expect(state.totalPrice).toBe(150); // 50 * 3
    });
  });

  describe("clearCart", () => {
    it("should reset cart to initial state", () => {
      const stateWithItems = {
        ...initialState,
        items: [createMockCartItem(), createMockCartItem({ identifier: 2 })],
        totalItems: 2,
        totalPrice: 160,
        isLoading: true,
        error: "Some error",
      };

      const state = cartReducer(stateWithItems, clearCart());

      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("setDiscount", () => {
    it("should set fixed discount", () => {
      const state = cartReducer(initialState, setDiscount({ amount: 20, type: "fixed" }));

      expect(state.discountAmount).toBe(20);
      expect(state.discountType).toBe("fixed");
    });

    it("should set percentage discount", () => {
      const state = cartReducer(initialState, setDiscount({ amount: 15, type: "percentage" }));

      expect(state.discountAmount).toBe(15);
      expect(state.discountType).toBe("percentage");
    });
  });

  describe("setCartLoading", () => {
    it("should set loading state", () => {
      const state = cartReducer(initialState, setCartLoading(true));
      expect(state.isLoading).toBe(true);

      const state2 = cartReducer(state, setCartLoading(false));
      expect(state2.isLoading).toBe(false);
    });
  });

  describe("setCartError", () => {
    it("should set error message", () => {
      const state = cartReducer(initialState, setCartError("Failed to load cart"));

      expect(state.error).toBe("Failed to load cart");
    });

    it("should clear error with null", () => {
      const stateWithError = { ...initialState, error: "Some error" };

      const state = cartReducer(stateWithError, setCartError(null));

      expect(state.error).toBeNull();
    });
  });

  describe("loadCartFromStorage", () => {
    it("should load items and calculate totals", () => {
      const items = [
        createMockCartItem({ identifier: 1, quantity: 2 }),
        createMockCartItem({ identifier: 2, quantity: 1 }),
      ];

      const state = cartReducer(initialState, loadCartFromStorage(items));

      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(3); // 2 + 1
    });
  });

  describe("selectors", () => {
    const stateWithCart = {
      cart: {
        items: [createMockCartItem()],
        totalItems: 1,
        totalPrice: 80,
        discountAmount: 10,
        discountType: "fixed" as const,
        isLoading: true,
        error: "Error",
      },
    };

    it("selectCartItems should return items", () => {
      expect(selectCartItems(stateWithCart)).toHaveLength(1);
    });

    it("selectCartTotalItems should return total items count", () => {
      expect(selectCartTotalItems(stateWithCart)).toBe(1);
    });

    it("selectCartTotalPrice should return total price", () => {
      expect(selectCartTotalPrice(stateWithCart)).toBe(80);
    });

    it("selectCartIsLoading should return loading state", () => {
      expect(selectCartIsLoading(stateWithCart)).toBe(true);
    });

    it("selectCartError should return error", () => {
      expect(selectCartError(stateWithCart)).toBe("Error");
    });
  });
});
