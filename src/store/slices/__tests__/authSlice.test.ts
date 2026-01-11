import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  otpSuccess,
  otpFailure,
  logout,
  logoutFailure,
  clearError,
  setAuthLoading,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
  selectOTPVerified,
} from "../authSlice";
import { User } from "@/features/auth/types";

// Mock user factory
const createMockUser = (overrides: Partial<User> = {}): User => ({
  identifier: 1,
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: 1234567890,
  isVerified: true,
  createdDate: "2024-01-01T00:00:00Z",
  lastChange: "2024-01-01T00:00:00Z",
  ...overrides,
});

describe("authSlice", () => {
  const initialState = {
    isAuthenticated: false,
    currentUser: null,
    isLoading: false,
    error: null,
    otpEmail: null,
    otpVerified: false,
  };

  describe("login flow", () => {
    it("loginStart should set loading and clear error", () => {
      const stateWithError = { ...initialState, error: "Previous error" };

      const state = authReducer(stateWithError, loginStart());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("loginSuccess should set user and authenticated state", () => {
      const loadingState = { ...initialState, isLoading: true };
      const user = createMockUser();

      const state = authReducer(
        loadingState,
        loginSuccess({
          data: { user, token: "mock-jwt-token" },
          message: "Login successful",
          status: "success",
        })
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser).toEqual(user);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("loginFailure should set error and clear auth state", () => {
      const loadingState = { ...initialState, isLoading: true };

      const state = authReducer(
        loadingState,
        loginFailure({
          data: { message: "Invalid credentials", status: "error" },
        })
      );

      expect(state.isAuthenticated).toBe(false);
      expect(state.currentUser).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Invalid credentials");
    });

    it("loginFailure should handle object error messages", () => {
      const state = authReducer(
        initialState,
        loginFailure({
          data: {
            message: { email: ["Email is invalid"] },
            status: "error",
          },
        } as unknown as Parameters<typeof loginFailure>[0])
      );

      expect(state.error).toBe("Email is invalid");
    });
  });

  describe("register flow", () => {
    it("registerStart should set loading and clear error", () => {
      const state = authReducer(initialState, registerStart());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("registerSuccess should set user and authenticated state", () => {
      const user = createMockUser();

      const state = authReducer(
        { ...initialState, isLoading: true },
        registerSuccess({
          data: user,
          message: "Registration successful",
          status: "success",
        })
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser).toEqual(user);
      expect(state.isLoading).toBe(false);
    });

    it("registerFailure should set error", () => {
      const state = authReducer(
        { ...initialState, isLoading: true },
        registerFailure({
          data: { message: "Email already exists", status: "error" },
        })
      );

      expect(state.error).toBe("Email already exists");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("OTP verification", () => {
    it("otpSuccess should set user and mark OTP as verified", () => {
      const user = createMockUser();

      const state = authReducer(
        initialState,
        otpSuccess({
          data: { user, token: "mock-jwt-token" },
          message: "Email verified",
          status: "success",
        })
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser).toEqual(user);
      expect(state.otpVerified).toBe(true);
    });

    it("otpFailure should set error and mark OTP as not verified", () => {
      const state = authReducer(
        initialState,
        otpFailure({
          data: { message: "Invalid OTP", status: "error" },
        })
      );

      expect(state.error).toBe("Invalid OTP");
      expect(state.otpVerified).toBe(false);
    });
  });

  describe("logout", () => {
    it("logout should reset to initial state", () => {
      const authenticatedState = {
        ...initialState,
        isAuthenticated: true,
        currentUser: createMockUser(),
        otpVerified: true,
      };

      const state = authReducer(authenticatedState, logout());

      expect(state.isAuthenticated).toBe(false);
      expect(state.currentUser).toBeNull();
      expect(state.otpVerified).toBe(false);
      expect(state.error).toBeNull();
    });

    it("logoutFailure should set error", () => {
      const state = authReducer(
        initialState,
        logoutFailure({
          data: { message: "Logout failed", status: "error" },
        })
      );

      expect(state.error).toBe("Logout failed");
    });
  });

  describe("utility actions", () => {
    it("clearError should clear error", () => {
      const stateWithError = { ...initialState, error: "Some error" };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });

    it("setAuthLoading should set loading state", () => {
      const state = authReducer(initialState, setAuthLoading(true));
      expect(state.isLoading).toBe(true);

      const state2 = authReducer(state, setAuthLoading(false));
      expect(state2.isLoading).toBe(false);
    });
  });

  describe("selectors", () => {
    const stateWithAuth = {
      auth: {
        isAuthenticated: true,
        currentUser: createMockUser(),
        isLoading: true,
        error: "Error",
        otpEmail: "test@example.com",
        otpVerified: true,
      },
    };

    it("selectIsAuthenticated should return auth status", () => {
      expect(selectIsAuthenticated(stateWithAuth)).toBe(true);
    });

    it("selectCurrentUser should return user", () => {
      expect(selectCurrentUser(stateWithAuth)).toEqual(createMockUser());
    });

    it("selectAuthLoading should return loading state", () => {
      expect(selectAuthLoading(stateWithAuth)).toBe(true);
    });

    it("selectAuthError should return error", () => {
      expect(selectAuthError(stateWithAuth)).toBe("Error");
    });

    it("selectOTPVerified should return OTP verified state", () => {
      expect(selectOTPVerified(stateWithAuth)).toBe(true);
    });
  });
});
