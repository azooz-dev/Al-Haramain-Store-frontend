import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@shared/components/ui/card";
import { useApp } from "@/shared/contexts/AppContext";
import { usePrefetch } from "@/shared/hooks/usePrefetch";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { ProductImage } from "../details/ProductImage";
import { ProductInfo } from "../details/ProductInfo";
import { ProductActions } from "../details/ProductActions";
import { TransformedProduct } from "../../types";
import { useCart } from "@/features/cart/hooks/useCart";
import { useToast } from "@/shared/hooks/useToast";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface ProductCardProps {
  product: TransformedProduct;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { isRTL } = useApp();
  const { t: productsT } = useFeatureTranslations("products");
  const { prefetchProduct } = usePrefetch();
  const { navigateToProductDetail } = useNavigation();
  const { handleAddToCart } = useCart();
  const { toast } = useToast();


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

  const onAddToCart = useCallback(async () => {
    const result = await handleAddToCart({
      identifier: product.identifier,
      quantity: 1 as number,
      orderable: 'product',
      price: product.price as number,
      amount_discount_price: product.amount_discount_price as number,
      image: product.image,
      en: product.en,
      ar: product.ar,
      color: product.colors?.[0],
      variant: product.colors?.[0]?.variants?.[0],
    });
    if (result) {
      toast.success(productsT("details.successAddingToCart"));
    } else {
      toast.error(productsT("details.errorAddingToCart"));
    }
  }, [product, handleAddToCart, toast, productsT]);

  const handleCardClick = useCallback(() => {
    // Navigate to product detail page using React Router
    navigateToProductDetail(product.slug, product.identifier);
  }, [product.slug, product.identifier, navigateToProductDetail]);

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
            amount_discount_price={product.amount_discount_price}
          />

          <ProductActions
            product={product}
            onAddToCart={async () => onAddToCart()}
          />
        </div>
      </CardContent>
    </Card>
  );
})