import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useApp } from '@/shared/contexts/AppContext';
import { useNavigation } from '@/shared/hooks/useNavigation';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToProducts, navigateToAboutPage } = useNavigation();

    return (
    <section className={`relative h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.2'%3E%3Cpath d='M30 30l15-15v30l-15-15z'/%3E%3Cpath d='M30 30l-15-15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {homeT("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {homeT("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              size="lg"
              onClick={() => navigateToProducts()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {homeT("hero.shopNow")}
              {isRTL ? <ArrowLeft className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateToAboutPage()}
              className="px-8 py-3 rounded-full border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              {homeT("hero.exploreCollection")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}