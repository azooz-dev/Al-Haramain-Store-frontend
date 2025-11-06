import React from "react";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { useApp } from "@shared/contexts/AppContext";
import { Category } from "@/features/categories/types";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { Button } from "../../ui/button";

interface Props {
  categories: Category[];
}

export const FooterCategories: React.FC<Props> = ({ categories }) => {
  const { t: shared } = useSharedTranslations('shared');
  const { isRTL } = useApp();
  const { navigateToProducts } = useNavigation();

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3 className="text-lg font-semibold">{shared('footer.categories.title')}</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.identifier}>
            <Button
              onClick={() => navigateToProducts()}
              variant="link"
              className="text-muted-foreground hover:text-amber-400 transition-colors text-sm md:text-base block py-1 hover:no-underline"
            >
              { isRTL ? category.ar.title : category.en.title }
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
