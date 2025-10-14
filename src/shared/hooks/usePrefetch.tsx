import { useAppDispatch } from "@/store/hooks";
import { productApi } from "@/features/products/services/productApi";
import { favoriteApi } from "@/features/favorites/services/favoriteApi";

export const usePrefetch = () => {
  const dispatch = useAppDispatch();

  const prefetchProduct = (productId: number) => {
    dispatch(productApi.util.prefetch("getProduct", productId, { force: false }));
  };

  const prefetchFavorites = (userId: number) => {
    dispatch(favoriteApi.util.prefetch("getUserFavorites", userId, { force: false }));
  }

  return {
    prefetchProduct,
    prefetchFavorites,
  }
}