import React from "react";
import { ShoppingCart, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ImageWithFallback } from "@/shared/components/common/ImageWithFallback";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { Favorite } from "../types";
import { APP_CONFIG } from "@/shared/config/config";

interface FavoritesListProps {
  favorites: Favorite[];
  viewMode: "grid" | "list";
  searched: boolean;
  onRemoveFromFavorites: (favoriteId: number) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  viewMode,
  searched,
  onRemoveFromFavorites,
}) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");
  const { navigateToProductDetail } = useNavigation();
  const url = APP_CONFIG.apiBaseUrl;

  if (favorites && favorites.length === 0 || !favorites) {
        return (
      <div className="text-center py-12">
        <div className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
          {searched ? (
            <>
              <p className="text-lg mb-2">
                {favoritesT("list.noMatchingProducts")}
              </p>
              <p className="text-sm">
                {favoritesT("list.trySearchingWithDifferentKeywords")}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">
                {favoritesT("list.emptyList")}
              </p>
              <p className="text-sm">
                {favoritesT("list.addFavoriteProducts")}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite: Favorite) => (
            <Card key={`${favorite.product.identifier}-${favorite.product.color?.id}`} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="relative">
                  <ImageWithFallback
                    src={`${url}/storage/${favorite.product.image.image_url}`}
                    alt={isRTL ? favorite.product.ar.title : favorite.product.en.title}
                    className="w-full  object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveFromFavorites(
                      favorite.identifier,
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <h3 className={`font-medium text-sm mb-2 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? favorite.product.ar.title : favorite.product.en.title}
                  </h3>
                  
                  <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <span className="text-lg font-bold text-green-600">
                      ${favorite.product.variant?.amount_discount_price || favorite.product.variant?.price}
                    </span>
                    {favorite.product.variant?.amount_discount_price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${favorite.product.variant?.price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigateToProductDetail(favorite.product.slug, favorite.product.identifier)}
                    >
                      <Eye className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {favoritesT("list.viewProduct")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => false} // temporary
                    >
                      <ShoppingCart className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {favoritesT("list.addToCart")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite: Favorite) => (
            <Card key={`${favorite.product.identifier}-${favorite.product.color?.id}`} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`flex gap-4 ${isRTL ? '' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={`${url}/storage/${favorite.product.image.image_url}`}
                      alt={isRTL ? favorite.product.ar.title : favorite.product.en.title}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveFromFavorites(
                        favorite.identifier,
                      )}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-medium text-lg mb-2">
                      {isRTL ? favorite.product.ar.title : favorite.product.en.title}
                    </h3>
                    
                    <div className={`flex items-center gap-2 mb-4 mt-4 `}>
                      <span className="text-xl font-bold text-green-600">
                        ${favorite.product.variant?.amount_discount_price || favorite.product.variant?.price}
                      </span>
                      {favorite.product.variant?.amount_discount_price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${favorite.product.variant?.price}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 flex-row-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToProductDetail(favorite.product.slug, favorite.product.identifier)}
                      >
                        <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {favoritesT("list.viewProduct")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => false} // temporary
                      >
                        <ShoppingCart className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {favoritesT("list.addToCart")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}