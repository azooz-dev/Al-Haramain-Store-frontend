import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { APP_CONFIG } from "@/shared/config/config";
import { getCookieValue } from "@/shared/utils/getCookieValue";
import { logout } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";

/**
 * Raw base query with credentials and CSRF protection
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Add CSRF token from meta tag or cookie
    const csrfToken =
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") ||
      getCookieValue("XSRF-TOKEN") ||
      getCookieValue("csrf-token");

    if (csrfToken) {
      headers.set("X-CSRF-TOKEN", csrfToken);
    }

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");

    return headers;
  },
});

/**
 * Public paths that should not trigger auto-logout on 401
 */
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

/**
 * Base query wrapper that:
 * 1. Adds locale header to all requests
 * 2. Handles 401 Unauthorized by dispatching logout action
 * 3. Provides consistent error structure
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Get current language from state
  const language = (api.getState() as RootState)?.ui?.language || "en";

  // Normalize args to object format
  if (typeof args === "string") {
    args = { url: args };
  }

  // Add locale header (except for CSRF cookie endpoint)
  if (typeof args === "object" && args.url !== "/sanctum/csrf-cookie") {
    const headers = new Headers(args.headers as HeadersInit);
    headers.set("X-locale", language);
    args = { ...args, headers };
  }

  // Execute the request
  const result = await rawBaseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - session expired
  if (result.error && result.error.status === 401) {
    const currentPath = window.location.pathname;
    const isPublicPath = PUBLIC_PATHS.some((path) =>
      currentPath.startsWith(path)
    );

    // Only auto-logout if not on public pages
    if (!isPublicPath) {
      api.dispatch(logout());
    }
  }

  return result;
};
