import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@shared/components/ui/input';
import { useSharedTranslations } from '@shared/hooks/useTranslation';


const SearchInput: React.FC<{ isRTL: boolean; searchQuery: string; onSearchChange: (v: string) => void }> = ({ isRTL, searchQuery, onSearchChange }) => {
  const { t: shared } = useSharedTranslations('shared');
  
  return (
    <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
      <div className="relative w-full">
        <Search className={`absolute top-6 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={shared('search.title')}
          className={`w-full ${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-0 rounded-full`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
};


export default SearchInput;