import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { useApp } from "@shared/contexts/AppContext";

export const FooterCompanyInfo: React.FC = () => {
  const { t: shared } = useSharedTranslations('shared');
  const { isRTL } = useApp();

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div
        className={`flex items-center ${
          isRTL ? "" : ""
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl flex-shrink-0">
          ح
        </div>
        <div className="text-xl font-semibold mr-2 ml-2">Al-Haramain</div>
      </div>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
        {shared('footer.description')}
      </p>
      <div className="space-y-3">
        <div
          className="flex items-center text-muted-foreground text-sm gap-2"
        >
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="break-all">{shared('footer.email')}</span>
        </div>
        <div
          className="flex items-center text-muted-foreground text-sm gap-2"
        >
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span>{shared('footer.phone')}</span>
        </div>
        <div
          className="flex items-start text-muted-foreground text-sm gap-2"
        >
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="break-words">{shared('footer.address')}</span>
        </div>
      </div>
    </div>
  );
};
