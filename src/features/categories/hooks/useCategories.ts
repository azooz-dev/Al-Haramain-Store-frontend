import { useGetCategoriesQuery, useGetCategoryByIdQuery } from "../services/categoryApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setCategories,
	setCurrentCategory,
	setCategoryLoading,
	setCategoryError,
} from "@/store/slices/categoriesSlice";
import { useEffect } from "react";

export const useCategories = (categoryId?: number) => {
	const dispatch = useAppDispatch();
	const { categories, currentCategory, isLoading, error } = useAppSelector(
		(state) => state.categories
	);

	// Fetch all categories
	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useGetCategoriesQuery();

	// Check if category is already in categories list
	const existingCategory = categoryId
		? categories.find((cat) => cat.identifier === categoryId)
		: null;

	// Only fetch specific category if not found in categories list
	const shouldFetchCategory = categoryId && !existingCategory;

	// Fetch specific category only if needed
	const {
		data: categoryData,
		isLoading: categoryLoading,
		error: categoryError,
	} = useGetCategoryByIdQuery(categoryId as number, {
		skip: !shouldFetchCategory,
	});

	// Update slice when API data changes
	useEffect(() => {
		if (categoriesData) {
			dispatch(setCategories(categoriesData));
		}
		if (categoriesError) {
			const errorMessage =
				"message" in categoriesError
					? categoriesError.message || "Failed to fetch categories"
					: "Failed to fetch categories";
			dispatch(setCategoryError(errorMessage));
		}
		if (categoriesLoading !== undefined) {
			dispatch(setCategoryLoading(categoriesLoading));
		}
	}, [categoriesData, categoriesError, categoriesLoading, dispatch]);

	// Update slice for specific category
	useEffect(() => {
		if (categoryData) {
			dispatch(setCurrentCategory(categoryData));
		} else if (existingCategory && categoryId) {
			// If category exists in categories list, set it as current category
			dispatch(
				setCurrentCategory({
					data: existingCategory,
					message: "Category found in existing data",
					status: "success",
				})
			);
		}
		if (categoryError) {
			const errorMessage =
				"message" in categoryError
					? categoryError.message || "Failed to fetch category"
					: "Failed to fetch category";
			dispatch(setCategoryError(errorMessage));
		}
	}, [categoryData, categoryError, existingCategory, categoryId, dispatch]);

	return {
		categories: categoriesData?.data?.data,
		category: currentCategory || existingCategory,
		isLoading: isLoading || categoriesLoading || (shouldFetchCategory ? categoryLoading : false),
		error,
	};
};
