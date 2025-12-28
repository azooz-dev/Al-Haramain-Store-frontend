import React from "react";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { FooterCompanyInfo } from "./FooterCompanyInfo";
import { FooterQuickLinks } from "./FooterQuickLinks";
import { FooterCategories } from "./FooterCategories";
import { FooterSocialNewsletter } from "./FooterSocialNewsletter";
import { FooterBottomBar } from "./FooterBottomBar";
import { useCategories } from "@/features/categories/hooks/useCategories";

export const Footer: React.FC = () => {
  const { t: shared } = useSharedTranslations('shared');

  const quickLinks = [
    { key: "home", label: shared('footer.quickLinks.home'), path: "/" },
    { key: "products", label: shared('footer.quickLinks.products'), path: "/products" },
    { key: "about", label: shared('footer.quickLinks.about'), path: "/about" },
    { key: "contact", label: shared('footer.quickLinks.contact'), path: "/contact" },
  ];

  const { categories } = useCategories();


  return (
    <footer className="bg-gradient-to-br from-background to-muted text-foreground relative overflow-hidden border-t">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <FooterCompanyInfo />
          <FooterQuickLinks quickLinks={quickLinks} />
          <FooterCategories categories={categories} />
          <FooterSocialNewsletter />
        </div>
        <FooterBottomBar />
      </div>
    </footer>
  );
};
