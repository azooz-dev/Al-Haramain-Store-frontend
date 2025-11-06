import React from "react";
import { Heart } from "lucide-react";
import { useApp } from "@shared/contexts/AppContext";
import { useSharedTranslations } from "@shared/hooks/useTranslation";

export const FooterBottomBar: React.FC = () => {
  const { isRTL } = useApp();
  const { t: shared } = useSharedTranslations('shared');

  return (
    <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8">
      <div
        className={`flex flex-col ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        } justify-between items-center gap-4`}
      >
        <div
          className={`text-muted-foreground text-sm ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          © 2025 {shared('footer.companyName')}.{" "}
          {isRTL ? shared('footer.rights.ar') : shared('footer.rights.en')}.
        </div>
        <div
          className={`flex ${
            isRTL ? "flex-row-reverse space-x-reverse" : "space-x-6"
          } flex-wrap gap-4 md:gap-6`}
        >
          <a
            href="#"
            className="text-muted-foreground hover:text-amber-400 text-sm transition-colors"
          >
            {isRTL ? shared('footer.privacy.ar') : shared('footer.privacy.en')}
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-amber-400 text-sm transition-colors"
          >
            {isRTL ? shared('footer.terms.ar') : shared('footer.terms.en')}
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-amber-400 text-sm transition-colors"
          >
            {isRTL ? shared('footer.shipping.ar') : shared('footer.shipping.en')}
          </a>
        </div>
      </div>

      <div
        className={`text-center mt-4 text-xs text-muted-foreground ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {isRTL ? (
          <>
            {shared('footer.madeWith.ar')} <Heart className="inline h-3 w-3 text-red-500 mx-1" /> {shared('footer.madeWith.in')}
          </>
        ) : (
          <>
            {shared('footer.madeWith.en')} <Heart className="inline h-3 w-3 text-red-500 mx-1" /> {shared('footer.madeWith.in')}
          </>
        )}
      </div>
    </div>
  );
};
