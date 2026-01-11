import productsReducer, {
  setProducts,
  setCategories,
  setFeaturedProducts,
  setSelectedCategories,
  toggleSelectedCategory,
  setProductsLoading,
  setProductsError,
  setSearchQuery,
  setSortBy,
  setPaginationData,
  setCurrentPage,
  setItemsPerPage,
  clearFilters,
  selectProducts,
  selectCategories,
  selectSelectedCategories,
  selectIsLoading,
  selectError,
  selectSearchQuery,
  selectSortBy,
  selectCurrentPage,
} from "../productSlice";
import { Product } from "@/features/products/types";
import { Category } from "@/features/categories/types";

// Mock product factory
const createMockProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    identifier: 1,
    slug: "test-product",
    sku: "TEST-001",
    stock: 10,
    en: { title: "Test Product", details: "Test description" },
    ar: { title: "منتج اختبار", details: "وصف اختبار" },
    colors: [],
    reviews: [],
    categories: [1],
    min_price: 80,
    max_price: 100,
    price_range: "$80 - $100",
    createdDate: "2024-01-01T00:00:00Z",
    lastChange: "2024-01-01T00:00:00Z",
    total_images_count: 1,
    available_sizes: ["S", "M", "L"],
    available_colors: ["Red", "Blue"],
    ...overrides,
  }) as Product;

// Mock category factory
const createMockCategory = (overrides: Partial<Category> = {}): Category =>
  ({
    identifier: 1,
    slug: "electronics",
    en: { title: "Electronics", details: "Electronic products" },
    ar: { title: "إلكترونيات", details: "المنتجات الإلكترونية" },
    image: "/electronics.jpg",
    createdDate: "2024-01-01T00:00:00Z",
    lastChange: "2024-01-01T00:00:00Z",
    ...overrides,
  }) as Category;

describe("productSlice", () => {
  const initialState = {
    products: [],
    categories: [],
    featuredProducts: [],
    isLoading: false,
    error: null,
    searchQuery: "",
    selectedCategories: [],
    sortBy: "newest" as const,
    currentPage: 1,
    itemsPerPage: 6,
    totalPages: 1,
    totalItems: 1,
    perPage: 6,
  };

  describe("setProducts", () => {
    it("should set products array", () => {
      const products = [createMockProduct({ identifier: 1 }), createMockProduct({ identifier: 2 })];

      const state = productsReducer(initialState, setProducts(products));

      expect(state.products).toHaveLength(2);
      expect(state.products).toEqual(products);
    });
  });

  describe("setCategories", () => {
    it("should set categories array", () => {
      const categories = [createMockCategory({ identifier: 1 }), createMockCategory({ identifier: 2 })];

      const state = productsReducer(initialState, setCategories(categories));

      expect(state.categories).toHaveLength(2);
    });
  });

  describe("setFeaturedProducts", () => {
    it("should set featured products", () => {
      const products = [createMockProduct()];

      const state = productsReducer(initialState, setFeaturedProducts(products));

      expect(state.featuredProducts).toHaveLength(1);
    });
  });

  describe("category selection", () => {
    it("setSelectedCategories should set selected categories", () => {
      const state = productsReducer(initialState, setSelectedCategories([1, 2, 3]));

      expect(state.selectedCategories).toEqual([1, 2, 3]);
    });

    it("toggleSelectedCategory should add category if not selected", () => {
      const state = productsReducer(initialState, toggleSelectedCategory(1));

      expect(state.selectedCategories).toContain(1);
    });

    it("toggleSelectedCategory should remove category if already selected", () => {
      const stateWithCategory = { ...initialState, selectedCategories: [1, 2] };

      const state = productsReducer(stateWithCategory, toggleSelectedCategory(1));

      expect(state.selectedCategories).not.toContain(1);
      expect(state.selectedCategories).toContain(2);
    });
  });

  describe("loading and error", () => {
    it("setProductsLoading should set loading state", () => {
      const state = productsReducer(initialState, setProductsLoading(true));
      expect(state.isLoading).toBe(true);

      const state2 = productsReducer(state, setProductsLoading(false));
      expect(state2.isLoading).toBe(false);
    });

    it("setProductsError should set error message", () => {
      const state = productsReducer(initialState, setProductsError("Failed to load"));


      expect(state.error).toBe("Failed to load");
    });

    it("setProductsError should clear error with null", () => {
      const stateWithError = { ...initialState, error: "Error" };

      const state = productsReducer(stateWithError, setProductsError(null));

      expect(state.error).toBeNull();
    });
  });

  describe("search and sort", () => {
    it("setSearchQuery should set query and reset page", () => {
      const stateOnPage5 = { ...initialState, currentPage: 5 };

      const state = productsReducer(stateOnPage5, setSearchQuery("shoes"));

      expect(state.searchQuery).toBe("shoes");
      expect(state.currentPage).toBe(1);
    });

    it("setSortBy should set sort option and reset page", () => {
      const stateOnPage5 = { ...initialState, currentPage: 5 };

      const state = productsReducer(stateOnPage5, setSortBy("price-low"));

      expect(state.sortBy).toBe("price-low");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("pagination", () => {
    it("setPaginationData should update all pagination fields", () => {
      const paginationData = {
        currentPage: 3,
        totalPages: 10,
        totalItems: 100,
        perPage: 12,
      };

      const state = productsReducer(initialState, setPaginationData(paginationData));

      expect(state.currentPage).toBe(3);
      expect(state.totalPages).toBe(10);
      expect(state.totalItems).toBe(100);
      expect(state.perPage).toBe(12);
    });

    it("setCurrentPage should update page", () => {
      const state = productsReducer(initialState, setCurrentPage(5));

      expect(state.currentPage).toBe(5);
    });

    it("setItemsPerPage should update items per page", () => {
      const state = productsReducer(initialState, setItemsPerPage(12));

      expect(state.itemsPerPage).toBe(12);
    });
  });

  describe("clearFilters", () => {
    it("should reset all filters to default", () => {
      const filteredState = {
        ...initialState,
        searchQuery: "test",
        selectedCategories: [1, 2],
        sortBy: "price-high" as const,
        currentPage: 5,
      };

      const state = productsReducer(filteredState, clearFilters());

      expect(state.searchQuery).toBe("");
      expect(state.selectedCategories).toEqual([]);
      expect(state.sortBy).toBe("newest");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("selectors", () => {
    const stateWithProducts = {
      products: {
        products: [createMockProduct()],
        categories: [createMockCategory()],
        featuredProducts: [],
        isLoading: true,
        error: "Error",
        searchQuery: "search",
        selectedCategories: [1],
        sortBy: "price-low" as const,
        currentPage: 2,
        itemsPerPage: 12,
        totalPages: 5,
        totalItems: 50,
        perPage: 12,
      },
    };

    it("selectProducts should return products state", () => {
      expect(selectProducts(stateWithProducts)).toEqual(stateWithProducts.products);
    });

    it("selectCategories should return categories", () => {
      expect(selectCategories(stateWithProducts)).toHaveLength(1);
    });

    it("selectSelectedCategories should return selected categories", () => {
      expect(selectSelectedCategories(stateWithProducts)).toEqual([1]);
    });

    it("selectIsLoading should return loading state", () => {
      expect(selectIsLoading(stateWithProducts)).toBe(true);
    });

    it("selectError should return error", () => {
      expect(selectError(stateWithProducts)).toBe("Error");
    });

    it("selectSearchQuery should return search query", () => {
      expect(selectSearchQuery(stateWithProducts)).toBe("search");
    });

    it("selectSortBy should return sort option", () => {
      expect(selectSortBy(stateWithProducts)).toBe("price-low");
    });

    it("selectCurrentPage should return current page", () => {
      expect(selectCurrentPage(stateWithProducts)).toBe(2);
    });
  });
});
