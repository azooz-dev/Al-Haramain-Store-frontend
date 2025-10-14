import React from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface FavoritesActionsProps {
  totalItems: number;
  onClearAll: () => void;
  onBulkAddToCart: () => void;
};

export const FavoritesActions: React.FC<FavoritesActionsProps> = ({
  totalItems,
  onClearAll,
  onBulkAddToCart,
}) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Bulk Actions */}
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row-reverse'}`}>
        <Button
          onClick={onBulkAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <ShoppingCart className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {favoritesT("actions.bulkAddToCart")}
        </Button>

        <Button
          onClick={onClearAll}
          variant="destructive"
        >
          <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {favoritesT("actions.clearAll")}
        </Button>
      </div>
    </div>
  );
}