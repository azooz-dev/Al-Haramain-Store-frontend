import React from 'react';
import { ArrowRight, ArrowLeft, Grid3x3 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { APP_CONFIG } from '@/shared/config/config';

export const CategoriesSection: React.FC = () => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToCategoriesDetails } = useNavigation();
  const { categories, isLoading } = useCategories();

  const categoryColors = [
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-rose-500 to-pink-600",
    "from-gray-500 to-slate-600"
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden bg-card/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl">
            <CardContent className="p-0 relative">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

    return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6">
            <Grid3x3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">
            {homeT("categories.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {homeT("categories.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            categories.slice(0, 6).map((category, index) => (
              <Card
                key={category.identifier}
                className="group overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
                onClick={() =>
                  navigateToCategoriesDetails(category.identifier, category.slug)
                }
              >
                <CardContent className="p-0 relative">
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={`${APP_CONFIG.apiBaseUrl}/storage/${category.image}`}
                      alt={isRTL ? category.ar.title : category.en.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${categoryColors[index % categoryColors.length]}/80 mix-blend-overlay`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Decorative Elements */}
                    <div className="absolute top-6 left-6 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                    <div className="absolute bottom-8 right-8 w-3 h-3 bg-white/40 rounded-full animate-bounce" />
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <div className="space-y-3">
                      <h3
                        className={`text-xl group-hover:text-amber-600 transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {isRTL ? category.ar.title : category.en.title}
                      </h3>
                      <p
                        className={`text-muted-foreground text-sm leading-relaxed ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {isRTL ? category.ar.details : category.en.details}
                      </p>
                    </div>

                    {/* Hover Button */}
                    <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <Button
                        variant="outline"
                        className={`w-full border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {homeT("categories.viewCategory")}
                        {isRTL ? (
                          <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
                        ) : (
                          <ArrowLeft className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </div>

                    {/* Background Decoration */}
                    <div
                      className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-20 h-20 bg-gradient-to-br ${categoryColors[index % categoryColors.length]}/10 rounded-full transform translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
}
