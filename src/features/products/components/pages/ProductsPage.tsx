import React, { useState } from "react";
import { ProfessionalPagination } from "@/shared/components/common/ProfessionalPagination";
import { ProductSearch } from "../filters/ProductSearch";
import { ProductFilters } from "../filters/ProductFilters";
import { ProductSorting } from "../filters/ProductSorting";
import { ProductViewToggle } from "../filters/ProductViewToggle";
import { ProductsList } from "../listing/ProductsList";
import { useProducts } from "../../hooks/useProducts";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useCategories } from "@/features/categories/hooks/useCategories";

export const ProductsPage: React.FC = () => {
  const {
    filteredProducts,
    isLoading,
    searchQuery,
    selectedCategories,
    sortBy,
    priceRange,
    priceMaxBound,

    // pagination
    currentPage,
    totalPages,

    // Actions 
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
    clearFilters,
    setSelectedPriceRange,
  } = useProducts();

  const { categories } = useCategories();
  const { t: productT } = useFeatureTranslations("products");

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategory(categoryId);
  }

  const handleClearFilters = () => {
    clearFilters();
  }


  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-4">{productT("ourProducts")}</h1>
          <p className="text-muted-foreground text-lg">
            {productT("ourProductsDescription")}
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <ProductSearch
              searchQuery={searchQuery}
              showFilters={showFilters}
              onSearchChange={setSearchQuery}
              onFiltersToggle={() => setShowFilters(!showFilters)}
            />
          </div>
          <div className={`flex items-center gap-2 md:gap-4 mt-4 md:mt-0 `}>
            <ProductSorting sortBy={sortBy} onSortByChange={(sort) => setSortBy(sort as 'rating' | 'newest' | 'oldest' | 'price-low' | 'price-high' | 'price-asc' | 'price-desc')} />
            <ProductViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              priceMaxBound={priceMaxBound}
              categories={Array.isArray(categories) ? categories : []}
              onCategoryToggle={handleCategoryToggle}
              onPriceRangeChange={setSelectedPriceRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-1">
            <ProductsList
              products={filteredProducts}
              viewMode={viewMode}
              isLoading={isLoading}
              currentPage={currentPage}
            />
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <ProfessionalPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
              maxVisiblePages={7}
              showFirstLast={true}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            />
          </div>
        )}

      </div>
    </div>
  );
}