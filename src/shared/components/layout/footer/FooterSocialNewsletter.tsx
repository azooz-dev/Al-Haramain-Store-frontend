import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { useApp } from "@shared/contexts/AppContext";

export const FooterSocialNewsletter: React.FC = () => {
  const { t: shared } = useSharedTranslations('shared');
  const { isRTL } = useApp();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3 className="text-lg font-semibold">{shared('footer.followUs')}</h3>
      <div
        className={`flex ${
          isRTL ? "flex-row-reverse space-x-reverse" : "space-x-4"
        } flex-wrap gap-3`}
      >
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="w-10 h-10 rounded-full bg-muted hover:bg-amber-600 flex items-center justify-center transition-all duration-300 group hover:scale-110"
            aria-label={social.label}
          >
            <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <h4 className="text-sm text-muted-foreground font-medium">
          {isRTL ? shared('footer.subscribe.ar') : shared('footer.subscribe.en')}
        </h4>
        <div
          className={`flex ${
            isRTL ? "flex-row-reverse space-x-reverse" : "space-x-2"
          } flex-col sm:flex-row gap-2`}
        >
          <input
            type="email"
            placeholder={isRTL ? shared('footer.subscribe.email.ar') : shared('footer.subscribe.email.en')}
            className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
            dir={isRTL ? "rtl" : "ltr"}
          />
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white transition-all duration-300 hover:scale-105 text-sm font-medium whitespace-nowrap">
            {isRTL ? shared('footer.subscribe.button.ar') : shared('footer.subscribe.button.en')}
          </button>
        </div>
      </div>
    </div>
  );
};
