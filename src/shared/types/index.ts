export type PageType =
  | 'home'
  | 'products'
  | 'product-details'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'dashboard-orders'
  | 'dashboard-settings'
  | 'favorites';

export type DashboardTab =
  | 'profile'
  | 'orders'
  | 'reviews'
  | 'favorites'
  | 'settings';

export interface NavigationParams {
  page: PageType;
  productId?: string;
  dashboardTab?: DashboardTab;
}