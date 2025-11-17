import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useToast } from "@/shared/hooks/useToast";
import { FavoritesAddRequest, FavoritesRemoveRequest, Favorite } from "../types";
import { ProcessedError } from "@/shared/types";

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
  customStyles?: {
    unfavorited?: string;
    favorited?: string;
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
  customStyles,
}) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");
  const { isAuthenticated, currentUser } = useAuth();
  const { toggleFavorite, isLoadingFavorites, isFavorite, addFavoriteError, removeFavoriteError } = useFavorites() as {
    toggleFavorite: (payload: FavoritesAddRequest | FavoritesRemoveRequest) => Promise<boolean>;
    isLoadingFavorites: boolean;
    isFavorite: (productId: number) => Favorite | null;
    addFavoriteError: ProcessedError | undefined;
    removeFavoriteError: ProcessedError | undefined;
  };
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const defaultText = {
    add: favoritesT("toggleButton.add"),
    remove: favoritesT("toggleButton.remove"),
  };

  const buttonText = text || defaultText;

  // Default styles
  const defaultUnfavoritedStyles = 'text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
  const defaultFavoritedStyles = 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20';

  // Use custom styles if provided, otherwise use defaults
  const unfavoritedStyles = customStyles?.unfavorited || defaultUnfavoritedStyles;
  const favoritedStyles = customStyles?.favorited || defaultFavoritedStyles;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setIsLoading(true);
    const response = await toggleFavorite({
      userId: currentUser?.identifier as number,
      productId,
      colorId: colorId as number,
      variantId: variantId as number,
    });
    setIsLoading(false);
    if (response) {
      toast.success(favoritesT("toggleButton.successAddingToFavorites"));
    } else {
      const error = addFavoriteError || removeFavoriteError;
      toast.error(error?.data.message as string);
    }
  }

    return (
    <Button
      size={size}
      variant={variant}
      className={`transition-all duration-200 ${
        isFavorite(productId) 
          ? favoritedStyles
          : unfavoritedStyles
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