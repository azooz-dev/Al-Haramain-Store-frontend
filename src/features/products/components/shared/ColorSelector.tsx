import React from "react";
import { ProductColor } from "../../types";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColorId: number;
  onColorSelect: (colorId: number) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColorId, onColorSelect }) => {
  const { t: productT } = useFeatureTranslations("products");

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {productT('details.color')}
        </h4>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const colorCode = color.color_code || '#000000';
          const isValidColor = colorCode.startsWith('#') || colorCode.startsWith('rgb') || colorCode.startsWith('hsl');
          const displayColor = isValidColor ? colorCode : `#${colorCode}`;
          const isSelected = selectedColorId === color.id;
          
          return (
            <div key={color.id} className="relative group">
              <button
                onClick={() => onColorSelect(color.id)}
                className={`relative w-10 h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  isSelected
                    ? 'border-amber-500 shadow-lg shadow-amber-200/50 dark:shadow-amber-800/50'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                style={{ backgroundColor: displayColor }}
                title={`${productT('details.color')} ${colorCode}`}
              >
                {/* Hover effect overlay */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
                  isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'
                } bg-white dark:bg-gray-800`} />
              </button>
              
              {/* Color name tooltip on hover */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {colorCode}
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}