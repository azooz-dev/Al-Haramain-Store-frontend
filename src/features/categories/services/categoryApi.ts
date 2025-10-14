import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_CONFIG } from "@/shared/config/config";
import { CategoriesResponse, CategoryResponse } from "../types";

export const categoryApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_CONFIG.apiBaseUrl}/api`,
  }),
  tagTypes: ["Categories", "Category"],
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
      keepUnusedDataFor: 600,
    }),

    // Get a category by id
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (categoryId) => `/categories/${categoryId}`,
      providesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Categories", id: "LIST" }
      ],
      keepUnusedDataFor: 600,
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} = categoryApi;