import React from "react";
import { Heart, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useApp } from "@/shared/contexts/AppContext";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useNavigation } from "@/shared/hooks/useNavigation";

interface FavoritesEmptyStateProps {
  searched: boolean;
}

export const FavoritesEmptyState: React.FC<FavoritesEmptyStateProps> = ({ searched }) => {
  const { isRTL } = useApp();
  const { t: favoritesT } = useFeatureTranslations("favorites");
  const { navigateTo } = useNavigation();

    return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-12 text-center max-w-md mx-auto">
        <CardContent className="p-6">
          <Heart className="w-16 h-16 text-red-200 mx-auto mb-6" />
          
          {searched ? (
            <>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {favoritesT("emptyState.searched.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isRTL 
                  ? favoritesT("emptyState.searched.description")
                  : favoritesT("emptyState.searched.description")
                }
              </p>
              <Button
                variant="outline"
                onClick={() => navigateTo('/products')}
              >
                {favoritesT("emptyState.searched.button")}
                {isRTL ? <ArrowLeft className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} /> : <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />}
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {favoritesT("emptyState.empty.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isRTL 
                  ? favoritesT("emptyState.empty.description")
                  : favoritesT("emptyState.empty.description")
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigateTo('/products')}
                >
                  <ShoppingBag className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {favoritesT("emptyState.empty.button")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigateTo('/')}
                >
                  {favoritesT("emptyState.empty.button")}
                  {isRTL ? <ArrowLeft className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} /> : <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}