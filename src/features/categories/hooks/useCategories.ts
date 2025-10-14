import { useGetCategoriesQuery } from "../services/categoryApi";

export const useCategories = () => {
  const { data: categories } = useGetCategoriesQuery();

  return { categories };
}
