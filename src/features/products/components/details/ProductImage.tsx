import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useApp } from '@/shared/contexts/AppContext';

interface ProductImageProps {
  image: string;
  name: string;
  isNew?: boolean;
  discount?: number;
}

export const ProductImage: React.FC<ProductImageProps> = React.memo(({
  image,
  name,
  isNew,
  discount,
}) => {
  const { t: productT } = useFeatureTranslations("products");
  const { isRTL } = useApp();

    return (
    <div className="relative overflow-hidden">
      <div className="aspect-[4/5] relative">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Clean Status Badges */}
        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-col gap-1.5 z-10`}>
          {isNew && (
            <Badge className="bg-green-500 text-white px-2 py-1 text-xs border-0">
              {productT("image.new")}
            </Badge>
          )}
          {
            discount ? (
              (discount > 0) && (
                <Badge className="bg-red-500 text-white px-2 py-1 text-xs border-0">
                  {`${Number(discount)}%-`}
                </Badge>
              )
            ) : null
          }
        </div>

      </div>
    </div>
  );
})