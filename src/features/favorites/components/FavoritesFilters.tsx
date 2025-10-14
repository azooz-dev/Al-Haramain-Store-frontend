import React from "react";
import { Search, SortAsc, Grid3X3, List } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface FavoritesFiltersProps {
  searchQuery: string;
  viewMode: "grid" | "list";
  sortBy: "newest" | "oldest" | "price-low" | "price-high";
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onSortByChange: (sort: "newest" | "oldest" | "price-low" | "price-high") => void;
}

export const FavoritesFilters: React.FC<FavoritesFiltersProps> = ({
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
  onSortByChange,
}) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");

    return (
    <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${
          isRTL ? 'right-3' : 'left-3'
        }`} />
        <Input
          placeholder={favoritesT("filters.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`mt-2 ${isRTL ? 'flex-row-reverse' : ''} px-3`}>
            <SortAsc className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {favoritesT("filters.sort")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? 'end' : 'start'}>
          <DropdownMenuItem onClick={() => onSortByChange('newest')}>
            {favoritesT("filters.newest")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortByChange('oldest')}>
            {favoritesT("filters.oldest")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortByChange('price-low')}>
            {favoritesT("filters.priceLow")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortByChange('price-high')}>
            {favoritesT("filters.priceHigh")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Toggle */}
      <div className="flex border rounded-lg">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="rounded-r-none mt-3"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="rounded-l-none mt-3"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}