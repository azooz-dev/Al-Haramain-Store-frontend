import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_CONFIG } from "@/shared/config/config";
import { ProductResponse, ProductsResponse, ProductRequest } from "../types";

const baseQuery = fetchBaseQuery({
  baseUrl: `${APP_CONFIG.apiBaseUrl}/api`,
  credentials: "include",
  validateStatus: (response) => response.status >= 200 && response.status < 300,
  prepareHeaders: (headers) => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }
  },
});

export const productApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQuery,
  tagTypes: ["Products", "Product", "Category"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductRequest>({
      query: (params) => ({
        url: "/products",
        params: params,
      }),
      providesTags: (result) => {
        const products = result?.data.data;
        if (!Array.isArray(products)) return ["Products"];
        return [
          'Products',
          ...products.map(({ identifier }) => ({ type: "Product" as const, id: identifier })),
        ]
      },
      keepUnusedDataFor: 300, // cache for 5 minutes
    }),

    getProduct: builder.query<ProductResponse, number>({
      query: (productId) => `/products/${productId}`,
      providesTags: (_result, _error, productId) => [{ type: "Product", id: productId }, { type: "Products", id: "LIST" }],
      keepUnusedDataFor: 600, // cache for 10 minutes
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
} = productApi;