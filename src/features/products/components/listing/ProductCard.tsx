import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@shared/components/ui/card";
import { useApp } from "@/shared/contexts/AppContext";
import { usePrefetch } from "@/shared/hooks/usePrefetch";
import { ProductImage } from "../details/ProductImage";
import { ProductInfo } from "../details/ProductInfo";
import { ProductActions } from "../details/ProductActions";
import { TransformedProduct } from "../../types";

interface ProductCardProps {
  product: TransformedProduct;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { isRTL } = useApp();
  const { prefetchProduct } = usePrefetch();


  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    prefetchProduct(product.identifier);
  }, [product.identifier, prefetchProduct]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const getProductName = (product: TransformedProduct) => {
    return isRTL ? product.ar.title : product.en.title;
  };

  const handleCardClick = useCallback(() => {
    // Navigate to product detail page
    window.location.href = `/products/${product.slug}`;
  }, [product.slug]);

  return (
    <Card 
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isHovering 
          ? 'shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50' 
          : 'shadow-sm shadow-gray-100/30 dark:shadow-gray-900/30'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <ProductImage
          image={product.image}
          name={getProductName(product)}
          isNew={product.isNew}
          discount={product.discount}
        />

        {/* Clean Content Section */}
        <div className="p-5 space-y-4">
          <ProductInfo
            name={getProductName(product)}
            rating={product.rating}
            reviews={product.reviewCount}
            price={product.price}
          />

          <ProductActions
            product={product}
            onAddToCart={async () => false}
          />
        </div>
      </CardContent>
    </Card>
  );
})