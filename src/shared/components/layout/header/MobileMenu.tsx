import React from 'react';
import { Search, X, Sun, Moon, Heart, LogIn, LogOut, User, Package, Settings } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Badge } from '@shared/components/ui/badge';
import { NavigationItem } from '@/shared/types/index';
import { useApp } from '@/shared/contexts/AppContext';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useNavigation } from '@/shared/hooks/useNavigation';

interface MobileMenuProps {
  isOnDashboard: boolean;
  closeMobileMenu: () => void;
  isMobileMenuAnimating: boolean;
  navigationItems: NavigationItem[];
}


const MobileMenu: React.FC<MobileMenuProps> = ({
  isOnDashboard,
  closeMobileMenu,
  isMobileMenuAnimating,
  navigationItems,
}) => {
  const { isRTL } = useApp();
  const { t: shared } = useSharedTranslations('shared');
  const { isAuthenticated, currentUser, handleSignOut } = useAuth();
  const { favoritesCount } = useFavorites();
  const { navigateToFavorites, navigateToSignIn, navigateToSignUp } = useNavigation();
  const { toggleLanguage, toggleTheme } = useApp();
  return (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu-backdrop" onClick={closeMobileMenu}></div>
      <div className="mobile-menu-container">
        <div className={`mobile-menu-content ${isMobileMenuAnimating ? 'mobile-menu-exit' : 'mobile-menu-enter'}`}>
          <div className="mobile-menu-header">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">ح</div>
                <span className="text-lg font-semibold">Al-Haramain</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigateToFavorites()} className="relative w-9 h-9 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title={isRTL ? shared('favorites.title') : shared('favorites.title')}>
                  <Heart className="h-4 w-4" />
                  {isAuthenticated && favoritesCount > 0 && (
                    <Badge className={`absolute h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center p-0 shadow-lg ${isRTL ? '-top-1 -left-1' : '-top-1 -right-1'}`}>
                      {favoritesCount > 99 ? shared('favorites.count.99') : favoritesCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleLanguage()} className="h-8 px-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title={isRTL ? shared('language.en') : shared('language.ar')}>
                  <span className="text-xs font-medium">{isRTL ? shared('language.en') : shared('language.ar')}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleTheme()} className="h-8 w-8 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title={isRTL ? shared('theme.dark') : shared('theme.light')}>
                  <Sun className="h-3 w-3 dark:hidden" />
                  <Moon className="h-3 w-3 hidden dark:block" />
                </Button>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu} className="h-8 w-8 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mobile-menu-body">
            <div className="relative mb-6">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input placeholder={shared('search.title')} className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-0 rounded-full`} dir={isRTL ? 'rtl' : 'ltr'} />
            </div>

            <div className="space-y-2 mb-6">
              {navigationItems.map((item: NavigationItem) => (
                <button key={item.key} onClick={() => false } className={`block w-full px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'} ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>
                  {item.label}
                </button>
              ))}
            </div>

            {isAuthenticated && currentUser && currentUser.identifier && currentUser.email && !isOnDashboard && (
              <div className="border-t border-border pt-4">
                <div className={`px-4 py-3 mb-4 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <div className="space-y-2 mb-4">
                  <button onClick={() => false } className={`block w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <User className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {shared('dashboard.title')}
                  </button>
                  <button onClick={() => false } className={`block w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Package className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {shared('orders.title')}
                  </button>
                  <button onClick={() => false } className={`block w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Settings className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {shared('settings.title')}
                  </button>
                </div>
                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className={`block w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <LogOut className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {shared('logout.title')}
                </button>
              </div>
            )}

            {isAuthenticated && currentUser && (currentUser).identifier && currentUser.email && isOnDashboard && (
              <div className="border-t border-border pt-4">
                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className={`block w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <LogOut className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {shared('logout.title')}
                </button>
              </div>
            )}

            {(!isAuthenticated || !currentUser || !currentUser.identifier || !currentUser.email) && (
              <div className="border-t border-border pt-4 space-y-3">
                <button onClick={() => navigateToSignIn()} className={`block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <LogIn className={`h-3 w-3 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {shared('signin.title')}
                </button>
                <button onClick={() => navigateToSignUp()} className={`block w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {shared('signup.title')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default MobileMenu;
