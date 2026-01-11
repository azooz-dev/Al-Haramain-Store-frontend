import { useCallback, useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProductsQuery } from "../services/productApi";
import {
	setProductsLoading,
	setProductsError,
	setCurrentPage,
	setPaginationData,
	toggleSelectedCategory,
	setSearchQuery,
	selectSearchQuery,
	setSortBy,
	clearFilters,
	selectProducts,
	selectSelectedCategories,
} from "@/store/slices/productSlice";
import { Product, TransformedProduct } from "../types";
import { APP_CONFIG } from "@/shared/config/config";

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];

export const useProducts = () => {
	const dispatch = useAppDispatch();
	const ProductsState = useAppSelector(selectProducts);
	const SearchQueryState = useAppSelector(selectSearchQuery);
	const selectedCategories = useAppSelector(selectSelectedCategories);
	const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
	const { data: productsData, isLoading } = useGetProductsQuery({
		page: ProductsState.currentPage,
		per_page: ProductsState.perPage,
	});


	const transformApiProduct = useCallback((product: Product): TransformedProduct | null => {
		if (!product || !product.en || !product.ar) return null;
		const reviews = product.reviews || [];
		const colors = product.colors || [];
		const categories = product.categories || [];

		const primaryColor = colors[0];
		const primaryImage = primaryColor?.images?.[0];
		const primaryVariant = primaryColor?.variants?.[0];

		return {
			identifier: product.identifier,
			slug: product.slug,
			sku: product.sku,
			stock: product.stock,
			en: product.en,
			ar: product.ar,
			colors: colors,
			reviews: reviews,
			categories: categories,
			min_price: product.min_price || 0,
			max_price: product.max_price || 0,
			price_range: product.price_range || "",
			createdDate: product.createdDate || new Date().toISOString(),
			lastChange: product.lastChange || new Date().toISOString(),
			price: primaryVariant?.price || 0,
			amount_discount_price: primaryVariant?.amount_discount_price
				? parseFloat(primaryVariant.amount_discount_price)
				: 0,
			image: primaryImage?.image_url
				? `${APP_CONFIG.apiBaseUrl}/storage/${primaryImage.image_url}`
				: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=400&h=400&fit=crop",
			rating:
				reviews.length > 0
					? reviews.reduce((sum, review) => sum + parseFloat(review.rating || "0"), 0) /
					reviews.length
					: 0,
			reviewCount: reviews.length,
			isNew:
				product.createdDate ? (new Date(product.createdDate).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 30) : false,
			discount: (primaryVariant?.price && primaryVariant?.amount_discount_price)
				? Math.round(
					((primaryVariant.price - parseFloat(primaryVariant.amount_discount_price)) /
						primaryVariant.price) *
					100
				)
				: 0,
			firstColorId: primaryColor?.id,
			firstVariantId: primaryVariant?.id,
			total_images_count: product.total_images_count || 0,
			available_sizes: product.available_sizes || [],
			available_colors: product.available_colors || [],
		};
	}, []);

	const transformedProducts = useMemo((): TransformedProduct[] => {
		if (!productsData) return [];

		// Handle potential nested data structure
		let apiProducts: Product[] = [];
		if (Array.isArray(productsData.data)) {
			apiProducts = productsData.data;
		} else if (productsData.data && Array.isArray((productsData.data as { data?: Product[] }).data)) {
			apiProducts = (productsData.data as { data: Product[] }).data;
		} else if (typeof productsData.data === 'object' && productsData.data !== null) {
			apiProducts = Object.values(productsData.data.data).filter(item =>
				typeof item === 'object' && item !== null && 'identifier' in item
			) as Product[];
		}

		return apiProducts
			.filter((product) => product !== null && product !== undefined)
			.map((product) => transformApiProduct(product))
			.filter((product): product is TransformedProduct => product !== null);
	}, [productsData, transformApiProduct]);

	const updatePaginationData = useCallback(() => {
		if (productsData?.data) {
			dispatch(
				setPaginationData({
					currentPage: productsData.data.current_page,
					totalPages: productsData.data.last_page,
					totalItems: productsData.data.total,
					perPage: productsData.data.per_page,
				})
			);
		}
	}, [productsData, dispatch]);

	useEffect(() => {
		updatePaginationData();
	}, [updatePaginationData]);

	const setLoadingState = useCallback(
		(loading: boolean) => {
			dispatch(setProductsLoading(loading));
		},
		[dispatch]
	);

	const calculatePriceRange = useCallback(() => {
		if (!transformedProducts.length) return setPriceRange(DEFAULT_PRICE_RANGE);

		const prices = transformedProducts
			.map((product) => product.price)
			.filter((price) => price !== null && price !== undefined);

		if (prices.length === 0) return setPriceRange(DEFAULT_PRICE_RANGE);

		const minPrice = Math.min(...prices.map(Number));
		const maxPrice = Math.max(...prices.map(Number));

		setPriceRange([minPrice, maxPrice]);
	}, [transformedProducts]);

	useEffect(() => {
		calculatePriceRange();
	}, [calculatePriceRange]);

	const setSelectedCategoryAction = useCallback(
		(categoryId: number) => {
			dispatch(toggleSelectedCategory(categoryId));
		},
		[dispatch]
	);

	const setSearchQueryAction = useCallback(
		(query: string) => {
			dispatch(setSearchQuery(query));
		},
		[dispatch]
	);

	const setProductsErrorAction = useCallback(
		(error: string | null) => {
			dispatch(setProductsError(error));
		},
		[dispatch]
	);

	const setSelectedPriceRangeAction = useCallback(
		(priceRange: [number, number]) => {
			setPriceRange(priceRange);
		},
		[setPriceRange]
	);

	const setSelectedSortBy = useCallback(
		(
			sortBy:
				| "rating"
				| "newest"
				| "oldest"
				| "price-low"
				| "price-high"
				| "price-asc"
				| "price-desc"
		) => {
			dispatch(setSortBy(sortBy));
		},
		[dispatch]
	);

	const clearAllFilters = useCallback(() => {
		dispatch(clearFilters());
		setPriceRange(DEFAULT_PRICE_RANGE);
		setSearchQueryAction("");
	}, [dispatch, setSearchQueryAction]);

	const updateCurrentPage = useCallback(
		(page: number) => {
			// Ensure the page is within the valid range
			const validPage = Math.max(1, Math.min(page, ProductsState.totalPages));
			dispatch(setCurrentPage(validPage));
		},
		[dispatch, ProductsState.totalPages]
	);

	const filteredProducts = useMemo(() => {
		if (!transformedProducts || transformedProducts.length === 0) return [];

		const searchQuery = SearchQueryState || ProductsState.searchQuery || "";
		const query = searchQuery.toLowerCase().trim();

		return transformedProducts.filter((product) => {
			const matchesSearch =
				!query ||
				product.en.title.toLowerCase().includes(query) ||
				product.ar.title.toLowerCase().includes(query);

			const productCategoryIds = product.categories || [];

			const matchesCategory =
				!selectedCategories ||
				selectedCategories.length === 0 ||
				selectedCategories.some((selectedCategoryId) =>
					productCategoryIds.includes(selectedCategoryId)
				);

			const matchesPrice =
				!priceRange || (product.price >= priceRange[0] && product.price <= priceRange[1]);

			return matchesSearch && matchesCategory && matchesPrice;
		});
	}, [
		transformedProducts,
		SearchQueryState,
		selectedCategories,
		priceRange,
		ProductsState.searchQuery,
	]);

	const filteredAndSortedProducts = useMemo(() => {
		if (!filteredProducts.length) return [];
		return [...filteredProducts].sort((a, b) => {
			switch (ProductsState.sortBy) {
				case "price-low":
				case "price-asc":
					return Number(a.price) - Number(b.price);
				case "price-desc":
				case "price-high":
					return Number(b.price) - Number(a.price);
				case "rating":
					return b.rating - a.rating;
				case "newest":
					return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
				case "oldest":
					return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
				default:
					return 0;
			}
		});
	}, [filteredProducts, ProductsState.sortBy]);


	const computedState = useMemo(
		() => ({
			products: filteredAndSortedProducts,
			totalPages: ProductsState.totalPages,
			totalItems: ProductsState.totalItems,
			perPage: ProductsState.perPage,
			currentPage: ProductsState.currentPage,
			isLoading: isLoading,
			productsError: ProductsState.error,
		}),
		[filteredAndSortedProducts, ProductsState, isLoading]
	);

	return {
		productsList: computedState.products,
		filteredProducts: filteredAndSortedProducts,
		isLoading: computedState.isLoading,
		productsError: computedState.productsError,
		searchQuery: SearchQueryState,
		selectedCategories: selectedCategories || [],
		sortBy: ProductsState.sortBy,
		currentPage: computedState.currentPage,
		totalPages: computedState.totalPages,
		totalItems: computedState.totalItems,
		perPage: computedState.perPage,
		priceRange,
		priceMaxBound: Math.max(...transformedProducts.map((p) => p.max_price), 1000),
		setSearchQuery: setSearchQueryAction,
		setProductsError: setProductsErrorAction,
		setProductsLoading: setLoadingState,
		setSortBy: setSelectedSortBy,
		setSelectedCategory: setSelectedCategoryAction,
		clearFilters: clearAllFilters,
		setCurrentPage: updateCurrentPage,
		setSelectedPriceRange: setSelectedPriceRangeAction,
		updatePaginationData: updatePaginationData,
	};
};
