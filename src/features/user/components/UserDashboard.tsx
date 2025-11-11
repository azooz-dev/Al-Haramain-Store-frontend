import React, { useState, useEffect } from 'react';
import { UserAccountSettings } from './UserAccountSettings';
import { UserProfile } from './UserProfile';
import { UserOrders } from './UserOrders';
import { UserReviews } from './UserReviews';
import { UserAddresses } from './UserAddresses';
import { Card, CardContent } from '@shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { LogOut } from 'lucide-react';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { DashboardTab } from '@/shared/types';
import { User } from '@/features/auth/types';
import { useNavigation } from '@/shared/hooks/useNavigation';

export const UserDashboard: React.FC = () => {
  const { isRTL } = useApp();
  const { t: userT } = useFeatureTranslations('user');
  const { currentUser, handleSignOut } = useAuth();
  const { userOrdersData, isLoadingUserOrders, userOrdersError } = useUsers();
  const location = useLocation();
  const { navigateToDashboard, navigateToDashboardOrders, navigateToDashboardSettings } = useNavigation();

  const getTabFromPath = (pathname: string): DashboardTab => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === 'orders') return 'orders';
    if (lastSegment === 'settings') return 'settings';
    return 'profile';
  }

  const [activeTab, setActiveTab] = useState<DashboardTab>(getTabFromPath(location.pathname));

  // Sync activeTab with URL path whenever location changes
  useEffect(() => {
    const tabFromPath = getTabFromPath(location.pathname);
    setActiveTab(tabFromPath);
  }, [location.pathname]);

  // Update URL when tab changes manually
  const handleTabChange = (value: string) => {
    const newTab = value as DashboardTab;
    setActiveTab(newTab);
    
    if (newTab === 'orders') {
      navigateToDashboardOrders();
    } else if (newTab === 'settings') {
      navigateToDashboardSettings();
    } else {
      navigateToDashboard();
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {isRTL ? userT("dashboard.loading") : userT("dashboard.loading")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

    return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isRTL ? userT("dashboard.title") : userT("dashboard.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL ? userT("dashboard.welcome") : userT("dashboard.welcome")} {currentUser?.firstName}!
            </p>
          </div>
          
          <div className='flex gap-3'>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              {isRTL ? userT("dashboard.logout") : userT("dashboard.logout")}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          className={`grid w-full grid-cols-5 mb-8 ${isRTL ? '[direction:rtl]' : ''}`}>
          <TabsTrigger value="profile">{isRTL ? userT("dashboard.profile") : userT("dashboard.profile")}</TabsTrigger>
          <TabsTrigger value="orders">{isRTL ? userT("dashboard.orders") : userT("dashboard.orders")}</TabsTrigger>
          <TabsTrigger value="addresses">{isRTL ? userT("dashboard.addresses") : userT("dashboard.addresses")}</TabsTrigger>
          <TabsTrigger value="reviews">{isRTL ? userT("dashboard.reviews") : userT("dashboard.reviews")}</TabsTrigger>
          <TabsTrigger value="settings">{isRTL ? userT("dashboard.settings") : userT("dashboard.settings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfile user={currentUser as User} />
        </TabsContent>

        <TabsContent value="orders">
          <UserOrders orders={userOrdersData?.data.data || []} isLoading={isLoadingUserOrders} error={userOrdersError as string | null} />
        </TabsContent>

        <TabsContent value="addresses">
          <UserAddresses 
            userId={currentUser?.identifier as number} 
          />
        </TabsContent>

        <TabsContent value="reviews">
          <UserReviews userId={currentUser?.identifier as number} />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <UserAccountSettings user={currentUser as User} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}