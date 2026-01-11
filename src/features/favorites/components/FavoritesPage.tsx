import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { usePrefetch } from "@/shared/hooks/usePrefetch";
import { FavoritesFilters } from "./FavoritesFilters";
import { FavoritesList } from "./FavoritesList";
import { FavoritesEmptyState } from "./FavoritesEmptyState";
import { FavoritesHeader } from "./FavoritesHeader";
import { FavoritesActions } from "./FavoritesActions";
import { FavoritesSkeleton } from "./FavoritesSkeleton";
import { useApp } from "@/shared/contexts/AppContext";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Favorite } from "../types";
import { useToast } from "@/shared/hooks/useToast";

export const FavoritesPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");
  const { navigateToSignIn, navigateToProducts } = useNavigation();
  const { prefetchFavorites } = usePrefetch();
  const { removeFavorite, isLoadingFavorites, filteredAndSortedFavorites } = useFavorites();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'price-asc' | 'price-desc'>('newest');
  const { currentUser, isAuthenticated } = useAuth();
  const totalFavorites = filteredAndSortedFavorites?.length;

  useEffect(() => {
    prefetchFavorites(currentUser?.identifier as number);
  }, [prefetchFavorites, currentUser?.identifier]);


  const favorites = filteredAndSortedFavorites(searchQuery, sortBy);

  const handleRemoveFromFavorites = async (favoriteId: number) => {
    const response = await removeFavorite({
      userId: currentUser?.identifier as number,
      favoriteId: favoriteId,
    });
    if (response.success) {
      toast.success(favoritesT("toggleButton.successRemovingFromFavorites"));
    } else {
      toast.error(response.error || "Failed to remove from favorites");
    }
  }

    const handleClearAll = () => {
    if (favorites && currentUser?.identifier) {
      favorites.forEach(async (favorite: Favorite) => {
        await removeFavorite({
          userId: currentUser.identifier,
          favoriteId: favorite.identifier,
        });
      });
    }
  }

  if (!isAuthenticated) {
        return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <Heart className="h-16 w-16 text-amber-600 dark:text-amber-400 fill-current" />
            </div>
            <h2 className="text-3xl mb-4">{favoritesT("emptyState.title")}</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {favoritesT("emptyState.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigateToSignIn()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full"
            >
              {favoritesT("emptyState.signIn")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigateToProducts()}
              className="px-8 py-3 rounded-full border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              {favoritesT("emptyState.browseProducts")}
            </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingFavorites) {
        return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className={`flex items-center justify-between mb-8 flex-row`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
              <div>
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <FavoritesSkeleton layout={viewMode} />
        </div>
      </div>
    );
  }

  if (totalFavorites === 0) {
        return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6">
              <Heart className="h-10 w-10 text-white fill-current" />
            </div>
            <h1 className="text-4xl mb-4">{favoritesT("title")}</h1>
            <p className="text-muted-foreground text-lg">
              {favoritesT("description")}
            </p>
          </div>

          <FavoritesEmptyState searched={false} />
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <FavoritesHeader totalFavorites={totalFavorites} />
        </div>

        <div className="mb-6">
          <FavoritesActions
            totalItems={totalFavorites}
            onClearAll={handleClearAll}
            onBulkAddToCart={() => alert('Bulk add to cart functionality')}
          />
        </div>

        <div className="mb-8">
          <FavoritesFilters
            searchQuery={searchQuery}
            viewMode={viewMode}
            onSearchChange={setSearchQuery}
            onViewModeChange={setViewMode}
            onSortByChange={(sort: 'newest' | 'oldest' | 'price-low' | 'price-high') => setSortBy(sort)}
          />
        </div>

        <FavoritesList
          favorites={favorites as Favorite[]}
          viewMode={viewMode}
          searched={!!searchQuery}
          onRemoveFromFavorites={handleRemoveFromFavorites}  
        />
      </div>
    </div>
  );
}