import uiReducer, {
  toggleTheme,
  toggleLanguage,
  setIsRTL,
  setIsLoading,
  setError,
  selectTheme,
  selectLanguage,
  selectIsRTL,
  selectIsLoading,
  selectError,
} from "../uiSlice";

describe("uiSlice", () => {
  const initialState = {
    theme: "light" as const,
    language: "en" as const,
    isRTL: false,
    isLoading: false,
    error: null,
  };

  describe("toggleTheme", () => {
    it("should toggle from light to dark", () => {
      const state = uiReducer(initialState, toggleTheme());

      expect(state.theme).toBe("dark");
    });

    it("should toggle from dark to light", () => {
      const darkState = { ...initialState, theme: "dark" as const };

      const state = uiReducer(darkState, toggleTheme());

      expect(state.theme).toBe("light");
    });
  });

  describe("toggleLanguage", () => {
    it("should toggle from en to ar and set RTL", () => {
      const state = uiReducer(initialState, toggleLanguage());

      expect(state.language).toBe("ar");
      expect(state.isRTL).toBe(true);
    });

    it("should toggle from ar to en and unset RTL", () => {
      const arabicState = { ...initialState, language: "ar" as const, isRTL: true };

      const state = uiReducer(arabicState, toggleLanguage());

      expect(state.language).toBe("en");
      expect(state.isRTL).toBe(false);
    });
  });

  describe("setIsRTL", () => {
    it("should set RTL to true", () => {
      const state = uiReducer(initialState, setIsRTL(true));

      expect(state.isRTL).toBe(true);
    });

    it("should set RTL to false", () => {
      const rtlState = { ...initialState, isRTL: true };

      const state = uiReducer(rtlState, setIsRTL(false));

      expect(state.isRTL).toBe(false);
    });
  });

  describe("setIsLoading", () => {
    it("should set loading to true", () => {
      const state = uiReducer(initialState, setIsLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const loadingState = { ...initialState, isLoading: true };

      const state = uiReducer(loadingState, setIsLoading(false));

      expect(state.isLoading).toBe(false);
    });
  });

  describe("setError", () => {
    it("should set error message", () => {
      const state = uiReducer(initialState, setError("Something went wrong"));

      expect(state.error).toBe("Something went wrong");
    });

    it("should clear error with null", () => {
      const errorState = { ...initialState, error: "Previous error" };

      const state = uiReducer(errorState, setError(null));

      expect(state.error).toBeNull();
    });
  });

  describe("selectors", () => {
    const stateWithUI = {
      ui: {
        theme: "dark" as const,
        language: "ar" as const,
        isRTL: true,
        isLoading: true,
        error: "Test error",
      },
    };

    it("selectTheme should return theme", () => {
      expect(selectTheme(stateWithUI)).toBe("dark");
    });

    it("selectLanguage should return language", () => {
      expect(selectLanguage(stateWithUI)).toBe("ar");
    });

    it("selectIsRTL should return RTL state", () => {
      expect(selectIsRTL(stateWithUI)).toBe(true);
    });

    it("selectIsLoading should return loading state", () => {
      expect(selectIsLoading(stateWithUI)).toBe(true);
    });

    it("selectError should return error", () => {
      expect(selectError(stateWithUI)).toBe("Test error");
    });
  });
});
