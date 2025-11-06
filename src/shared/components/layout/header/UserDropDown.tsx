import React from 'react';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/shared/contexts/AppContext';
import { useSharedTranslations } from '@/shared/hooks/useTranslation';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface UserDropdownProps {
  isAnimating: boolean;
  navigateToDashboard: () => void;
  navigateToDashboardOrders: () => void;
  navigateToDashboardSettings: () => void;
  handleSignOut: () => void;
  closeUserDropdown: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isAnimating,
  navigateToDashboard,
  navigateToDashboardOrders,
  navigateToDashboardSettings,
  handleSignOut,
  closeUserDropdown
}) => {
  const { isRTL } = useApp();
  const { t: shared } = useSharedTranslations('shared');
  const { currentUser } = useAuth();

  return (
    <div className="dropdown-3d">
      <div className={`absolute bg-card mt-4 w-56 bg-card/95 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-lg shadow-lg z-50 ${isRTL ? 'left-0' : 'right-0'} ${isAnimating ? 'dropdown-exit' : 'dropdown-enter'} dropdown-content`}>
        <div className={`px-3 py-2 ${isRTL ? 'rtl:text-right' : 'text-left'}`}>
          <p className="text-sm font-medium">{currentUser?.firstName} {currentUser?.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
        </div>
        <div className="border-t border-border">
          <button onClick={() => { navigateToDashboard(); closeUserDropdown(); }} className={`block w-full px-3 py-2 text-left hover:bg-muted transition-colors ${isRTL ? 'rtl:text-right' : ''}`}>
            <User className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {shared('dashboard.title')}
          </button>
          <button onClick={() => { navigateToDashboardOrders(); closeUserDropdown(); }} className={`block w-full px-3 py-2 text-left hover:bg-muted transition-colors ${isRTL ? 'rtl:text-right' : ''}`}>
            <Package className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {shared('orders.title')}
          </button>
          <button onClick={() => { navigateToDashboardSettings(); closeUserDropdown(); }} className={`block w-full px-3 py-2 text-left hover:bg-muted transition-colors ${isRTL ? 'rtl:text-right' : ''}`}>
            <Settings className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {shared('settings.title')}
          </button>
          <button onClick={() => { handleSignOut(); }} className={`block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isRTL ? 'rtl:text-right' : ''}`}>
            <LogOut className={`h-4 w-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>{shared('logout.title')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDropdown;