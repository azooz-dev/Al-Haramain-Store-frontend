import React, { useCallback } from "react";
import { Card, CardContent } from "@shared/components/ui/card";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { ProductCard } from "./ProductCard";
import { useApp } from "@/shared/contexts/AppContext";
import { usePrefetch } from "@/shared/hooks/usePrefetch";
import { ImageWithFallback } from "@/shared/components/common/ImageWithFallback";
import { Eye, ShoppingCart } from "lucide-react";
import { TransformedProduct } from "../../types";
import { Button } from "@/shared/components/ui/button";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useNavigation } from "@/shared/hooks/useNavigation";

interface ProductsListProps {
  products: TransformedProduct[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  currentPage: number;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  viewMode,
  isLoading,
}) => {
  const { isRTL } = useApp();
  const { prefetchProduct } = usePrefetch();
  const { navigateToProductDetail } = useNavigation();
  const { t: productT } = useFeatureTranslations('products');

  const handleCardHover = useCallback((product: TransformedProduct) => {
    prefetchProduct(product.identifier);
  }, [prefetchProduct]);

  if (isLoading) {
        return (
      <div className={`${viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' 
        : 'space-y-4'}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={`loading-${index}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
        return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className={`text-xl font-semibold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {productT('listing.noProductsFound')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {productT('listing.noProductsFoundDescription')}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {productT('listing.reloadPage')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.identifier}
              onMouseEnter={() => handleCardHover(product)}
            >
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.identifier} className="group hover:shadow-lg transition-all duration-300 p-2">
              <CardContent className="p-6">
                <div className={`flex gap-4`}>
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={isRTL ? product.ar.title : product.en.title}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  </div>

                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-medium text-lg mb-2">
                      {isRTL ? product.ar.title : product.en.title}
                    </h3>

                    <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="text-xl font-bold text-green-600">
                        ${product.amount_discount_price ? product.amount_discount_price.toFixed(2) : product.price}
                      </span>
                      {product.amount_discount_price && product.amount_discount_price !== product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <div className={`flex gap-2 flex-row-reverse`}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToProductDetail(product.slug, product.identifier)}
                      >
                        <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {productT('listing.viewProduct')}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigateToProductDetail(product.slug, product.identifier)}
                      >
                        <ShoppingCart className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {productT('listing.addToCart')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </>
  )
}
