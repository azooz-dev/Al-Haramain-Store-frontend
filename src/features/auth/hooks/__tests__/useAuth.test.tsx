/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useAuth } from "../useAuth";
import authReducer from "@/store/slices/authSlice";
import { User } from "@/features/auth/types";
import React from "react";

// Mock useAuthActions hook
jest.mock("../useAuthActions", () => ({
  useAuthActions: () => ({
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock user factory
const createMockUser = (): User => ({
  identifier: 1,
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: 1234567890,
  isVerified: true,
  createdDate: "2024-01-01T00:00:00Z",
  lastChange: "2024-01-01T00:00:00Z",
});

// Helper to create store with preloaded state
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

// Wrapper component
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
};

describe("useAuth", () => {
  describe("initial state", () => {
    it("should return unauthenticated state by default", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("authenticated state", () => {
    it("should return authenticated user when logged in", () => {
      const user = createMockUser();
      const store = createTestStore({
        auth: {
          isAuthenticated: true,
          currentUser: user,
          isLoading: false,
          error: null,
          otpEmail: null,
          otpVerified: false,
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser).toEqual(user);
    });
  });

  describe("loading state", () => {
    it("should return loading state during authentication", () => {
      const store = createTestStore({
        auth: {
          isAuthenticated: false,
          currentUser: null,
          isLoading: true,
          error: null,
          otpEmail: null,
          otpVerified: false,
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("error state", () => {
    it("should return error when authentication fails", () => {
      const store = createTestStore({
        auth: {
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
          error: "Invalid credentials",
          otpEmail: null,
          otpVerified: false,
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.error).toBe("Invalid credentials");
    });
  });

  describe("action availability", () => {
    it("should provide login, register, and logout actions", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.login).toBeDefined();
      expect(result.current.register).toBeDefined();
      expect(result.current.logout).toBeDefined();
    });
  });
});
