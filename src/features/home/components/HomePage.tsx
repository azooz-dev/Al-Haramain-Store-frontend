import React from 'react';
import { HeroSection } from './HeroSection';
import { OffersSection } from './OffersSection';
import { CategoriesSection } from './CategoriesSection';
import { FeaturedProductsSection } from './FeaturedProductsSection';

export const HomePage: React.FC = () => {
    return (
    <div className="min-h-screen">
      <HeroSection />
      <OffersSection />
      <CategoriesSection />
      <FeaturedProductsSection />
    </div>
  );
}