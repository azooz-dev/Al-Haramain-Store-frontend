import { http, HttpResponse } from "msw";
import { APP_CONFIG } from "@/shared/config/config";

const baseUrl = APP_CONFIG.apiBaseUrl;

// Auth handlers
export const authHandlers = [
  // Login
  http.post(`${baseUrl}/api/login`, async () => {
    return HttpResponse.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          email_verified_at: "2024-01-01T00:00:00Z",
        },
        token: "mock-jwt-token",
      },
    });
  }),

  // Register
  http.post(`${baseUrl}/api/register`, async () => {
    return HttpResponse.json({
      status: "success",
      message: "Registration successful. Please verify your email.",
      data: {
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
        },
      },
    });
  }),

  // Get current user
  http.get(`${baseUrl}/api/user`, async () => {
    return HttpResponse.json({
      data: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        email_verified_at: "2024-01-01T00:00:00Z",
      },
    });
  }),

  // Logout
  http.post(`${baseUrl}/api/logout`, async () => {
    return HttpResponse.json({
      status: "success",
      message: "Logged out successfully",
    });
  }),

  // CSRF cookie
  http.get(`${baseUrl}/sanctum/csrf-cookie`, async () => {
    return HttpResponse.json({ status: "success" });
  }),
];

// Product handlers
export const productHandlers = [
  // Get products
  http.get(`${baseUrl}/api/products`, async () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: "Test Product",
          slug: "test-product",
          description: "A test product",
          price: 99.99,
          amount_discount_price: 79.99,
          quantity: 100,
          image: "/images/test-product.jpg",
          category_id: 1,
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
      },
    });
  }),

  // Get single product
  http.get(`${baseUrl}/api/products/:id`, async ({ params }) => {
    return HttpResponse.json({
      data: {
        id: Number(params.id),
        name: "Test Product",
        slug: "test-product",
        description: "A test product",
        price: 99.99,
        amount_discount_price: 79.99,
        quantity: 100,
        image: "/images/test-product.jpg",
        category_id: 1,
      },
    });
  }),
];

// Category handlers
export const categoryHandlers = [
  http.get(`${baseUrl}/api/categories`, async () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          image: "/images/electronics.jpg",
        },
      ],
    });
  }),
];

// Favorites handlers
export const favoriteHandlers = [
  http.get(`${baseUrl}/api/favorites`, async () => {
    return HttpResponse.json({
      data: [],
    });
  }),

  http.post(`${baseUrl}/api/favorites`, async () => {
    return HttpResponse.json({
      status: "success",
      message: "Added to favorites",
    });
  }),
];

// Orders handlers
export const orderHandlers = [
  http.post(`${baseUrl}/api/orders`, async () => {
    return HttpResponse.json({
      status: "success",
      message: "Order created successfully",
      data: {
        id: 1,
        order_number: "ORD-001",
        status: "pending",
      },
    });
  }),
];

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...categoryHandlers,
  ...favoriteHandlers,
  ...orderHandlers,
];
