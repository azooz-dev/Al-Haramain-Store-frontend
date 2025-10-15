import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface FavoritesToggleButtonProps {
  productId: number;
  colorId?: number;
  variantId?: number;
  size?: "default" | "sm" | "lg";
  variant?: "outline" | "default" | "ghost" | "secondary";
  className?: string;
  showText?: boolean;
  text?: {
    add: string;
    remove: string;
  };
}

export const FavoritesToggleButton: React.FC<FavoritesToggleButtonProps> = ({
  productId,
  colorId,
  variantId,
  size = "default",
  variant = "outline",
  className,
  showText = true,
  text,
}) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");
  const { isAuthenticated, currentUser } = useAuth();
  const { toggleFavorite, isLoadingFavorites, isFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const defaultText = {
    add: favoritesT("toggleButton.add"),
    remove: favoritesT("toggleButton.remove"),
  };

  const buttonText = text || defaultText;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setIsLoading(true);
    await toggleFavorite({
      userId: currentUser?.identifier as number,
      productId,
      colorId: colorId as number,
      variantId: variantId as number,
    });
    setIsLoading(false);
  }

    return (
    <Button
      size={size}
      variant={variant}
      className={`transition-all duration-200 ${
        isFavorite(productId) 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
      } ${isLoadingFavorites ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className={`h-4 w-4 animate-spin ${showText ? (isRTL ? 'ml-2' : 'mr-2') : ''}`} />
      ) : (
        <Heart 
          className={`h-4 w-4 transition-all duration-200 ${
            isFavorite(productId) && isAuthenticated ? 'fill-current' : ''
          } ${showText ? (isRTL ? 'ml-2' : 'mr-2') : ''}`} 
        />
      )}
      {showText && !isLoading && (
        <span className="text-sm">
          {isFavorite(productId) ? buttonText.remove : buttonText.add}
        </span>
      )}
    </Button>
  );
}