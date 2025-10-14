import React from "react";
import { Heart } from "lucide-react";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface FavoritesHeaderProps {
  totalFavorites: number;
}

export const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ totalFavorites }) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");

    return (
    <div className="flex items-center gap-4">
      <Heart className="w-6 h-6 text-red-500" />
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h1 className="text-2xl font-bold text-foreground">
          {favoritesT("header.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isRTL 
            ? `${totalFavorites} ${totalFavorites === 1 ? favoritesT("header.product") : favoritesT("header.products")} ${favoritesT("header.saved")}`
            : `${totalFavorites} ${totalFavorites === 1 ? favoritesT("header.item") : favoritesT("header.items")} ${favoritesT("header.saved")}`
          }
        </p>
      </div>
    </div>
  );
}