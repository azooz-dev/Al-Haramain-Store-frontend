import React from "react";
import { Link } from "react-router-dom";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { useApp } from "@shared/contexts/AppContext";

interface Props {
  quickLinks: { key: string; label: string; path: string }[];
}

export const FooterQuickLinks: React.FC<Props> = ({ quickLinks }) => {
  const { t: shared } = useSharedTranslations('shared');
  const { isRTL } = useApp();

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3 className="text-lg font-semibold">{shared('footer.quickLinks.title')}</h3>
      <ul className="space-y-2">
        {quickLinks.map((link) => (
          <li key={link.key}>
            <Link
              to={link.path}
              className="text-muted-foreground hover:text-amber-400 transition-colors text-sm md:text-base block py-1"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
