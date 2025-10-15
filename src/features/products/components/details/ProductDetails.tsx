import React from "react";
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useApp } from "@/shared/contexts/AppContext";
import { ProductVariant, TransformedProduct } from "../../types";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { ColorSelector } from "../shared/ColorSelector";
import { VariantSelector } from "../shared/VariantSelector";

interface ProductDetailsProps {
  product: TransformedProduct;
  selectedVariant: ProductVariant;
  selectedColorId: number;
  onColorSelect: (colorId: number) => void;
  onVariantSelect: (variantId: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedVariant,
  selectedColorId,
  onColorSelect,
  onVariantSelect,
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
        <div className="flex items-center gap-2 mb-4 mt-4">
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
            {product.rating} ({product.reviewCount} {productT("details.reviews")})
          </span>
        </div>
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <ColorSelector
          colors={product.colors}
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
        />
      )}

      {/* Variant Selection */}
      {selectedVariant && (
        <VariantSelector
          variants={product.colors?.find(color => color.id === selectedColorId)?.variants || []}
          selectedVariantId={selectedVariant.id}
          onVariantSelect={onVariantSelect}
        />
      )}

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