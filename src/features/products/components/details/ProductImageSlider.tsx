import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { APP_CONFIG } from '@/shared/config/config';
import { ProductImage } from '../../types';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';

interface ProductImageSliderProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
}) => {
  const { isRTL } = useApp();
  const { t: productT } = useFeatureTranslations("products");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const API_BASE_URL = APP_CONFIG.apiBaseUrl;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  }

  if(!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">{productT("imageSlider.noImages")}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Main Image Display */}
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-0 relative">
          <div className="relative aspect-square w-full overflow-hidden">
            <ImageWithFallback
              src={`${API_BASE_URL}/storage/${images[currentImageIndex].image_url}`}
              alt={images[currentImageIndex].alt_text || (productName as string)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'hover:scale-105 cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-black/50 text-white backdrop-blur-sm">
                {currentImageIndex + 1} / {images.length}
              </Badge>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                  onClick={prevImage}
                >
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                  onClick={nextImage}
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </>
            )}

            {/* Zoom Indicator */}
            <div className="absolute bottom-4 left-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : 'border-transparent hover:border-amber-300'
                }`}
              >
                <ImageWithFallback
                  src={`${API_BASE_URL}/storage/${image.image_url}`}
                  alt={image.alt_text || `${productName as string} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}