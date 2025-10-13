import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonSpinner } from "@/shared/components/ui/spinner";
import { Product } from "../../types";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface ProductActionsProps {
  product: Product;
  onAddToCart: (quantity: number) => Promise<boolean>;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onAddToCart,
}) => {
  const { t: productT } = useFeatureTranslations("products");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    try {
      const success = await onAddToCart(quantity);

      if (success) {
        setQuantity(1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  }

  const canAddToCart = product.colors?.[0]?.variants?.[0].size && !isAddingToCart;

    return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12 shadow-lg"
        >
          {isAddingToCart ? (
            <ButtonSpinner className="mr-2" />
          ) : (
            <ShoppingCart className="w-4 h-4 mr-2" />
          )}
          {isAddingToCart 
            ? productT("actions.addingToCart")
            : productT("actions.addToCart")
          }
        </Button>
      </div>
    </div>
  );
}