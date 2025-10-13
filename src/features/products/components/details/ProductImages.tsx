import React from "react";
import { ProductImageSlider } from "./ProductImageSlider";
import { ProductImage } from "../../types/index";

interface ProductImageProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImages: React.FC<ProductImageProps> = ({
  images,
  productName,
}) => {
    return (
    <div className="space-y-4">
      <ProductImageSlider
        images={images}
        productName={productName}
      />
    </div>
  );
}