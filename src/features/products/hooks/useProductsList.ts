import { Category, Review, Product } from './../types/index';
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProductsQuery } from "../services/productApi";
import { setProductsLoading, setProductsError, setCurrentPage, setPaginationData } from "@/store/slices/productSlice";

export const useProductsList = () => {
  const dispatch = useAppDispatch();

  // Redux state selectors
  const productsState = useAppSelector((state) => state.products);

  // RTK Query hooks
  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error,
    refetch 
  } = useGetProductsQuery({
    page: productsState.currentPage,
    category: productsState.selectedCategory ? parseInt(productsState.selectedCategory) : undefined,
    search: productsState.searchQuery,
    sortBy: productsState.sortBy,
    per_page: productsState.itemsPerPage
  });
  

  const transformApiProduct = useCallback((apiProduct: Product) => {
    const primaryColor = apiProduct.colors?.[0];
    const primaryImage = primaryColor?.images?.[0];
    const primaryVariant = primaryColor?.variants?.[0];

    return {
      identifier: apiProduct.identifier,
      slug: apiProduct.slug,
      sku: apiProduct.sku,
      stock: apiProduct.stock,
      en: apiProduct.en,
      ar: apiProduct.ar,
      colors: apiProduct.colors,
      reviews: apiProduct.reviews,
      categories: apiProduct.categories,
      createdDate: apiProduct.createdDate,
      lastChange: apiProduct.lastChange,
      min_price: apiProduct.min_price,
      max_price: apiProduct.max_price,
      price_range: apiProduct.price_range,

      // Computed properties for UI
      originalPrice: primaryVariant?.amount_discount_price
        ? parseFloat(primaryVariant.amount_discount_price)
        : parseFloat(primaryVariant.price.toString()),
      image: primaryImage?.image_url
        ? `/storage/${primaryImage.image_url}`
        : null,
      rating: apiProduct.reviews?.length
        ? apiProduct.reviews.reduce((sum: number, review: Review) => sum + parseFloat(review.rating) || 0, 0) / apiProduct.reviews.length
        : 0,
      reviewsCount: apiProduct.reviews?.length || 0,
      isNew: new Date(apiProduct.createdDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
      categoryIds: apiProduct.categories.map((category: Category) => category.identifier),
      firstColorId: primaryColor?.id,
      firstVariantId: primaryVariant?.id,
    };
  }, []);

  const transformedProducts = useMemo(() => {
    if (!productsResponse?.data?.data) return [];

    const apiProducts = Array.isArray(productsResponse.data.data)
      ? productsResponse.data.data
      : Object.values(productsResponse.data.data);
    
    return apiProducts.map((apiProduct) => transformApiProduct(apiProduct as Product));
  }, [productsResponse, transformApiProduct]);

  const updatePaginationData = useCallback(() => {
    if (productsResponse?.data) {
      const paginationData = {
        currentPage: productsResponse.data.current_page || 0,
        itemsPerPage: productsResponse.data.per_page || 1,
        totalPages: productsResponse.data.last_page || 1,
        totalItems: productsResponse.data.total || 0,
        perPage: productsResponse.data.per_page || 6
      };

      dispatch(setPaginationData(paginationData));
    }
  }, [dispatch, productsResponse]);

  const setLoadingState = useCallback((loading: boolean) => {
    dispatch(setProductsLoading(loading));
  }, [dispatch]);

  const setErrorState = useCallback((error: string | null) => {
    dispatch(setProductsError(error));
  }, [dispatch]);

  const loadProducts = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const computedState = useMemo(() => ({
    products: transformedProducts,
    totalItems: productsResponse?.data?.total || 0,
    currentPage: productsResponse?.data?.current_page || 1,
    totalPages: productsResponse?.data?.last_page || 1,
    perPage: productsResponse?.data?.per_page || 6,
    isLoading: isLoading || isFetching,
    error: error?.toString() || null,
  }), [
    transformedProducts,
    productsResponse,
    isLoading,
    isFetching,
    error,
  ]);

  // Auto-update Redux state when API response changes
  useMemo(() => {
    updatePaginationData();
  }, [updatePaginationData]);

  // Auto-set loading state
  useMemo(() => {
    setLoadingState(isLoading);
  }, [isLoading, setLoadingState]);

  // Auto-set error state
  useMemo(() => {
    setErrorState(error?.toString() || null);
  }, [error, setErrorState]);
  
  return {
    // State
    ...computedState,

    // Actions
    loadProducts,
    refetch,
    setLoading: setLoadingState,
    setError: setErrorState,

    // Utilities
    transformProduct: transformApiProduct
  };
}
