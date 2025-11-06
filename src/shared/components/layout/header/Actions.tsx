import React from 'react';
import { ShoppingCart, Sun, Moon, Heart, LogIn, LogOut } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Avatar, AvatarFallback } from '@shared/components/ui/avatar';
import { Badge } from '@shared/components/ui/badge';
import { useApp } from '@/shared/contexts/AppContext';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useNavigation } from '@/shared/hooks/useNavigation';

interface ActionsProps {
  isMobile: boolean;
  openUserDropdown: () => void;
  isMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  isMobile,
  openUserDropdown,
  isMenuOpen,
  openMobileMenu,
  closeMobileMenu,
}) => {
  const { isRTL, toggleLanguage, toggleTheme } = useApp();
  const { t: shared } = useSharedTranslations('shared');
  const { isAuthenticated, currentUser, handleSignOut } = useAuth();
  const { cartSummary } = useCart();
  const { favoritesCount } = useFavorites();
  const { navigateToCart, navigateToFavorites, navigateToSignIn } = useNavigation();

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <div className="hidden md:flex items-center gap-2 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLanguage()}
          className="h-9 px-3 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          title={isRTL ? shared('language.en') : shared('language.ar')}
        >
          <span className="text-sm font-medium">{isRTL ? shared('language.en') : shared('language.ar')}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleTheme()}
          className="h-9 w-9 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          title={isRTL ? shared('theme.dark') : shared('theme.light')}
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToCart()}
        className="relative w-9 h-9 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        title={isRTL ? shared('cart.title') : shared('cart.title')}
      >
        <ShoppingCart className="h-4 w-4" />
        {cartSummary.itemsCount > 0 && (
          <Badge className={`absolute h-4 w-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs flex items-center justify-center p-0 shadow-lg ${isRTL ? '-top-1 -left-1' : '-top-1 -right-1'}`}>
            {cartSummary.itemsCount > 99 ? shared('cart.count.99') : cartSummary.itemsCount}
          </Badge>
        )}
      </Button>

      {!isMobile ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateToFavorites()}
          className="relative w-9 h-9 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title={isRTL ? shared('favorites.title') : shared('favorites.title')}
        >
          <Heart className="h-4 w-4" />
          {isAuthenticated && favoritesCount > 0 && (
            <Badge className={`absolute h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center p-0 shadow-lg ${isRTL ? '-top-1 -left-1' : '-top-1 -right-1'}`}>
              {favoritesCount > 99 ? shared('favorites.count.99') : favoritesCount}
            </Badge>
          )}
        </Button>
      ) : null}

      {isAuthenticated && currentUser ? (
        <div className="relative">
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20"
              title={isRTL ? shared('account.title') : shared('account.title')}
              onClick={openUserDropdown}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-amber-100 text-amber-800 text-xs dark:bg-amber-900 dark:text-amber-200">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
                    : currentUser.firstName?.[0] || currentUser.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSignOut()}
              className="h-9 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 rounded-full"
              title={isRTL ? shared('logout.title') : shared('logout.title')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="sm"
          onClick={() => navigateToSignIn()}
          className={`bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <LogIn className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          {shared('signin.title')}
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => (isMenuOpen ? closeMobileMenu() : openMobileMenu())}
        className="md:hidden w-9 h-9 rounded-full ml-1"
      >
        {/* Icon handled in MobileMenu component; simplifying here */}
        {isMenuOpen ? 'X' : '≡'}
      </Button>
    </div>
  );
};

export default Actions;