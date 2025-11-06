import React from 'react';
import { NavigationItem } from '@/shared/types/index';


const NavItems: React.FC<{
  navigationItems: NavigationItem[];
  currentPath: string;
  navigateTo: (path: string) => void
}> = ({ navigationItems, currentPath, navigateTo }) => (
  <nav className="hidden md:flex items-center flex-shrink-0 space-x-6 rtl:space-x-reverse">
      {navigationItems.map((item: NavigationItem) => (
        <button
        key={item.key}
        onClick={() => navigateTo(item.path)}
          className={`text-sm hover:text-primary transition-colors whitespace-nowrap ${
          currentPath === item.path ? 'text-primary font-medium' : 'text-muted-foreground'
        }`}
      >
        {item.label}
      </button>
    ))}
  </nav>
);


export default NavItems;