import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Grid3x3, Star, Heart, Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useApp } from "@/shared/contexts/AppContext";
import { useCategories } from "../hooks/useCategories";
import { ImageWithFallback } from "@/shared/components/common/ImageWithFallback";
import { CategorySkeleton } from "./CategorySkeleton";
import { APP_CONFIG } from "@/shared/config/config";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";
import { useNavigation } from "@/shared/hooks/useNavigation";

export const CategoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { navigateToHome } = useNavigation();
  const { isRTL } = useApp();
  const url = APP_CONFIG.apiBaseUrl;

  const { category, isLoading, error } = useCategories(Number(id));
  const { t: categoryT } = useFeatureTranslations("categories");

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-muted-foreground mb-4">
            {categoryT("details.errorTitle")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {categoryT("details.errorDescription")}
          </p>
          <Button onClick={() => navigateToHome()} className="px-8 py-3">
            {isRTL ? <ArrowRight className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
            {categoryT("details.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-muted-foreground mb-4">
            {isRTL ? categoryT("details.categoryNotFound") : categoryT("details.categoryNotFound")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isRTL ? categoryT("details.categoryNotFoundDescription") : categoryT("details.categoryNotFoundDescription")}
          </p>
          <Button onClick={() => navigateToHome()} className="px-8 py-3">
            {isRTL ? <ArrowRight className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
            {isRTL ? categoryT("details.goBack") : categoryT("details.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  const categoryTitle = category ? (isRTL ? category.ar.title : category.en.title) : "";
  const categoryDetails = category ? (isRTL ? category.ar.details : category.en.details) : "";
  const categoryImage = category ? `${url}/storage/${category.image}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Button
            variant="ghost"
            onClick={() => navigateToHome()}
            className={`mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? (
              <>
                {categoryT("details.goBack")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {categoryT("details.goBack")}
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6">
              <Grid3x3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {categoryTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {categoryDetails}
            </p>
          </div>
        </div>

        {/* Category Image Section */}
        <div className="mb-16">
          <Card className="overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative h-96 md:h-[500px]">
                <ImageWithFallback
                  src={categoryImage}
                  alt={categoryTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                <div className="absolute top-12 right-12 w-2 h-2 bg-orange-300 rounded-full animate-bounce" />
                <div className="absolute bottom-8 left-12 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Category Features */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? categoryT("details.highQuality") : categoryT("details.highQuality")}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? categoryT("details.madeFromTheBestRawMaterials")
                    : categoryT("details.madeFromTheBestRawMaterials")
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? categoryT("details.carefullyDesigned") : categoryT("details.carefullyDesigned")}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? categoryT("details.everyProductIsCarefullyDesignedForQualityAndBeauty")
                    : 'Every product is carefully designed for quality and beauty'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? categoryT("details.fastShipping") : categoryT("details.fastShipping")}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? categoryT("details.weDeliverYourProductsQuicklyAndSafelyToYourDoorstep")
                    : categoryT("details.weDeliverYourProductsQuicklyAndSafelyToYourDoorstep")
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}