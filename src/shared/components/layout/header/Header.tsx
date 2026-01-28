import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "@shared/contexts/AppContext";
import { useSharedTranslations } from "@shared/hooks/useTranslation";
import { useNavigation } from "@shared/hooks/useNavigation";
import { useAuth } from "@features/auth/hooks/useAuth";

import Logo from "./Logo";
import NavItems from "./NavItems";
import SearchInput from "./SearchInput";
import Actions from "./Actions";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";

export const Header: React.FC = () => {
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { isRTL } = useApp();
  const { t: shared } = useSharedTranslations('shared');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobileMenuAnimating, setIsMobileMenuAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redux state

  const { currentUser } = useAuth();

  const isOnDashboard = location.pathname === "/dashboard";



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeUserDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openUserDropdown = () => {
    setIsUserDropdownOpen(true);
    closeMobileMenu();
  };

  const closeUserDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsUserDropdownOpen(false);
      setIsAnimating(false);
    }, 200);
  };

  const openMobileMenu = () => {
    setIsMenuOpen(true);
    setIsMobileMenuAnimating(false);
    closeUserDropdown();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuAnimating(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMobileMenuAnimating(false);
    }, 200);
  };

  const navigationItems = [
    { key: "home", label: shared('home.title'), path: "/" },
    { key: "products", label: shared('products.title'), path: "/products" },
    { key: "about", label: shared('about.title'), path: "/about" },
    { key: "contact", label: shared('contact.title'), path: "/contact" },
  ];

  const navigateToDashboard = () => navigateTo("/dashboard");
  const navigateToDashboardOrders = () => navigateTo("/dashboard/orders");
  const navigateToDashboardSettings = () => navigateTo("/dashboard/settings");

  // Debounced prefetching logic kept in Header and passed to SearchInput
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      const timeoutId = setTimeout(() => false, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-8 flex-1 ${isRTL ? "ml-3" : "mr-3"}`}>
            <Logo />
            <NavItems navigationItems={navigationItems} currentPath={location.pathname} navigateTo={navigateTo} />
          </div>

          <SearchInput
            isRTL={isRTL}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          <Actions
            isMobile={isMobile}
            openUserDropdown={openUserDropdown}
            isMenuOpen={isMenuOpen}
            openMobileMenu={openMobileMenu}
            closeMobileMenu={closeMobileMenu}
          />
        </div>

        {isMenuOpen && (
          <MobileMenu
            isOnDashboard={isOnDashboard}
            closeMobileMenu={closeMobileMenu}
            isMobileMenuAnimating={isMobileMenuAnimating}
            navigationItems={navigationItems}
            navigateTo={navigateTo}
          />
        )}

        {/* User dropdown kept outside mobile menu */}
        <div ref={dropdownRef}>
          {isUserDropdownOpen && currentUser && (
            <UserDropdown
              isAnimating={isAnimating}
              navigateToDashboard={navigateToDashboard}
              navigateToDashboardOrders={navigateToDashboardOrders}
              navigateToDashboardSettings={navigateToDashboardSettings}
              closeUserDropdown={closeUserDropdown}
            />
          )}
        </div>
      </div>
    </header>
  );
};