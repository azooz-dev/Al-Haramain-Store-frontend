import React from "react";
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { useApp } from "@/shared/contexts/AppContext";
import { Product, ProductVariant } from "../../types";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface ProductDetailsProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedVariant,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

    return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isRTL ? product.ar.title : product.en.title}
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            4.8 ({product.reviews?.length || 0} {productT("details.reviews")})
          </span>
        </div>
        
        {/* Price Display */}
        {selectedVariant && (
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-amber-600">
              ${parseFloat(selectedVariant.amount_discount_price).toFixed(2) || selectedVariant.price.toFixed(2)}
            </span>
            {selectedVariant.amount_discount_price && selectedVariant.amount_discount_price !== selectedVariant.price.toFixed(2) && (
              <span className="text-xl text-muted-foreground line-through">
                ${selectedVariant.price.toFixed(2)}
              </span>
            )}
            {selectedVariant.amount_discount_price && selectedVariant.amount_discount_price !== selectedVariant.price.toFixed(2) && (
              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {productT("details.sale")}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Product Description */}
      <div>
        <h3 className="font-semibold mb-2">{productT("details.description")}</h3>
        <p className="text-muted-foreground leading-relaxed">
          <span
            dangerouslySetInnerHTML={{
              __html: isRTL
                ? product.ar.details
                : product.en.details
            }}
          />
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Truck className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-sm">{productT("details.freeShipping")}</p>
            <p className="text-xs text-muted-foreground">{productT("details.onAllOrders")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Shield className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-sm">{productT("details.qualityGuarantee")}</p>
            <p className="text-xs text-muted-foreground">{productT("details.oneYearWarranty")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <RotateCcw className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-sm">{productT("details.freeReturns")}</p>
            <p className="text-xs text-muted-foreground">{productT("details.within30Days")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}