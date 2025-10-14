import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useApp } from "@/shared/contexts/AppContext";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useProducts } from "../../hooks/useProducts";
import { ProductImages } from "../details/ProductImages";
import { ProductDetails } from "../details/ProductDetails";
import { ProductActions } from "../details/ProductActions";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { ProductColor, ProductVariant } from "../../types";
import { useParams, useNavigate } from "react-router-dom";

export const ProductDetailPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");
  const navigate = useNavigate();
  const {
    isLoading,
    productsList
  } = useProducts();
  const { id } = useParams();
  const product = productsList.find((product) => product.identifier === parseInt(id || '0'));

  // State for selected color and variant
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  // Initialize selected color and variant when product loads
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      const firstColor = product.colors[0];
      setSelectedColorId(firstColor.id);

      if (firstColor.variants && firstColor.variants.length > 0) {
        setSelectedVariantId(firstColor.variants[0].id);
      }
    }
  }, [product]);

  // Get the selected color object
  const selectedColor = useMemo(() => {
    if (!product || !selectedColorId) return null;
    return product.colors?.find((color: ProductColor) => color.id === selectedColorId) || null;
  }, [product, selectedColorId]);

  // Get the selected variant object
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedVariantId) return null;
    return selectedColor.variants?.find((variant: ProductVariant) => variant.id === selectedVariantId) || null;
  }, [selectedColor, selectedVariantId]);

  // Handlers
  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(colorId);
    
    // When color changes, select the first variant of that color
    const newColor = product?.colors?.find((color: ProductColor) => color.id === colorId);
    if (newColor && newColor.variants && newColor.variants.length > 0) {
      setSelectedVariantId(newColor.variants[0].id);
    }
  };

  const handleVariantSelect = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

  const handleAddToCart = async (quantity: number): Promise<boolean> => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', { 
      selectedColorId, 
      selectedVariantId,
      quantity 
    });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  if (isLoading) {
        return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Back Button Skeleton */}
                <Skeleton className="h-10 w-20 rounded-lg" />
                <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                  <Skeleton className="h-8 w-64" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <Skeleton className="h-16 w-16 rounded-lg" />
                <Skeleton className="h-16 w-16 rounded-lg" />
                <Skeleton className="h-16 w-16 rounded-lg" />
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="space-y-8">
              {/* Product Title & Rating */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Price Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Features Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !selectedColorId || !selectedVariantId || !selectedColor || !selectedVariant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {productT('details.productNotFound')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {productT('details.productNotFoundDescription')}
          </p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {productT('details.goBack')}
          </Button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#0a0a0a] dark:to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#0a0a0a] shadow-sm border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Beautiful Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                {isRTL ? (
                  <>
                    {productT('details.goBack')}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    {productT('details.goBack')}
                  </>
                )}
              </Button>
              
              {/* Product Title */}
              <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isRTL ? product.ar.title : product.en.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Dynamic based on selected color */}
          <ProductImages
            images={selectedColor.images}
            productName={isRTL ? product.ar.title : product.en.title}
          />

          {/* Product Details and Actions */}
          <div className="space-y-8">
            <ProductDetails
              product={product}
              selectedVariant={selectedVariant}
              selectedColorId={selectedColorId}
              onColorSelect={handleColorSelect}
              onVariantSelect={handleVariantSelect}
            />

            <ProductActions
              product={product}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}