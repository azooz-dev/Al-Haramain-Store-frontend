import { useAppDispatch } from "@/store/hooks";
import { productApi } from "@/features/products/services/productApi";

export const usePrefetch = () => {
  const dispatch = useAppDispatch();

  const prefetchProduct = (productId: number) => {
    dispatch(productApi.util.prefetch("getProduct", productId, { force: false }));
  };

  return {
    prefetchProduct,
  }
}