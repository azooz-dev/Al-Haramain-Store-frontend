import React from "react";
import { useFeatureTranslations } from "@/shared/hooks/useTranslation";

interface CartColorDisplayProps {
  colorCode: string;
}

export const CartColorDisplay: React.FC<CartColorDisplayProps> = ({ colorCode }) => {
  const { t: cartT } = useFeatureTranslations("cart");
  const validColorCode = colorCode || '#000000';
  const isValidColor = validColorCode.startsWith('#') || validColorCode.startsWith('rgb') || validColorCode.startsWith('hsl');
  const displayColor = isValidColor ? validColorCode : `#${validColorCode}`;

    return (
    <div className={`flex items-center  justify-end gap-2 flex-row-reverse`}>
      <div
        className='w-2 h-2 rounded-full transition-all duration-200  ring-2 ring-gray-300 ring-offset-1 scale-110'
        style={{ backgroundColor: displayColor }}
        title={`${cartT('display.color')} ${validColorCode}`}
      />
    </div>
  );
}