import React from 'react';
import { ArrowRight, ArrowLeft, Grid3x3 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ProductCard } from '@/features/products/components/listing/ProductCard';
import { ProductCardSkeleton } from '@/features/products/components/listing/ProductCardSkeleton';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useApp } from '@/shared/contexts/AppContext';

export const FeaturedProductsSection: React.FC = () => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToProducts } = useNavigation();
  const { productsList, isLoading, productsError } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (productsError) {
    return (
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6">
              <Grid3x3 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl mb-4">
              {homeT("featuredProducts.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {homeT("featuredProducts.description")}
            </p>
          </div>

          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {homeT("featuredProducts.error")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {homeT("featuredProducts.errorDescription")}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="px-8 py-3 rounded-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {homeT("featuredProducts.retry")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6">
            <Grid3x3 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">
            {homeT("featuredProducts.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {homeT("featuredProducts.description")}
          </p>
        </div>

        {productsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.slice(0, 6).map((product) => (
              <ProductCard
                key={product.identifier}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {homeT("featuredProducts.noProducts")}
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigateToProducts()}
            className="px-8 py-3 rounded-full border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            {homeT("featuredProducts.allProducts")}
            {isRTL ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}