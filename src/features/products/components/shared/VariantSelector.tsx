import React from "react";
import { Check, X } from "lucide-react";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { ProductVariant } from "../../types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: number;
  onVariantSelect: (variantId: number) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selectedVariantId, onVariantSelect }) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");

  if (!variants || variants.length === 0) {
    return null;
  }

  const selectedVariant = variants.find((variant: ProductVariant) => variant.id === selectedVariantId);
  const hasDiscount = selectedVariant?.amount_discount_price !== selectedVariant?.price;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {productT('details.size')}
        </h4>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.quantity === 0;
          
          return (
            <div key={variant.id} className="relative group">
              <button
                onClick={() => !isOutOfStock && onVariantSelect(variant.id)}
                disabled={isOutOfStock}
                className={`relative w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
                  isSelected
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-300 shadow-lg shadow-amber-200/50 dark:shadow-amber-800/50'
                    : isOutOfStock
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-500'
                    : 'border-gray-300 hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-orange-50/50 dark:border-gray-600 dark:hover:border-amber-500 dark:hover:from-amber-900/10 dark:hover:to-orange-900/10'
                }`}
              >
                <span className="block">{variant.size}</span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Out of stock indicator */}
                {isOutOfStock && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <X className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Hover effect */}
                {!isSelected && !isOutOfStock && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
              
              {/* Stock status tooltip */}
              {isOutOfStock && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    {productT('details.outOfStock')}
                  </div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Price Display */}
      {selectedVariant && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${selectedVariant.amount_discount_price || selectedVariant.price}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  ${selectedVariant.price}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                -{Math.round(((selectedVariant.price - Number(selectedVariant.amount_discount_price)) / selectedVariant.price) * 100)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            selectedVariant.quantity > 0 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`} />
          <span className={`font-medium ${
            selectedVariant.quantity > 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {selectedVariant.quantity > 0 ? (
              isRTL ? `${selectedVariant.quantity} ${productT('details.inStockAr')}` : `${selectedVariant.quantity} ${productT('details.inStock')}`
            ) : (
              productT('details.outOfStock')
            )}
          </span>
        </div>
      )}
    </div>
  );
}