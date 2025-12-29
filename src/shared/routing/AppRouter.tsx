import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/layout";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy load page components for code splitting
const HomePage = lazy(() => import("@/features/home/components/HomePage").then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("@/features/home/components/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("@/features/home/components/ContactPage").then(m => ({ default: m.ContactPage })));
const SignInPage = lazy(() => import("@/features/auth/components/SignInPage").then(m => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import("@/features/auth/components/SignUpPage").then(m => ({ default: m.SignUpPage })));
const OTPPage = lazy(() => import("@/features/auth/components/OTPPage").then(m => ({ default: m.OTPPage })));
const ForgetPasswordPage = lazy(() => import("@/features/auth/components/ForgetPasswordPage").then(m => ({ default: m.ForgetPasswordPage })));
const ResetPasswordPage = lazy(() => import("@/features/auth/components/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const ProductDetailPage = lazy(() => import("@/features/products/components/pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const ProductsPage = lazy(() => import("@/features/products/components/pages/ProductsPage").then(m => ({ default: m.ProductsPage })));
const CategoryDetailsPage = lazy(() => import("@/features/categories/components/CategoryDetailsPage").then(m => ({ default: m.CategoryDetailsPage })));
const FavoritesPage = lazy(() => import("@/features/favorites/components/FavoritesPage").then(m => ({ default: m.FavoritesPage })));
const OffersPage = lazy(() => import("@/features/offers/components/OffersPage").then(m => ({ default: m.OffersPage })));
const OffersDetailsPage = lazy(() => import("@/features/offers/components/OffersDetailsPage").then(m => ({ default: m.OffersDetailsPage })));
const CartPage = lazy(() => import("@/features/cart/components/CartPage").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("@/features/orders/components/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const UserDashboard = lazy(() => import("@/features/user/components/UserDashboard").then(m => ({ default: m.UserDashboard })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Wrapper to add Suspense to lazy-loaded components
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        {withSuspense(HomePage)}
      </Layout>
    ),
  },
  {
    path: "/about",
    element: <Layout>{withSuspense(AboutPage)}</Layout>,
  },
  {
    path: "/contact",
    element: <Layout>{withSuspense(ContactPage)}</Layout>,
  },
  {
    path: "/signin",
    element: <Layout>{withSuspense(SignInPage)}</Layout>,
  },
  {
    path: "/signup",
    element: <Layout>{withSuspense(SignUpPage)}</Layout>,
  },
  {
    path: "/verify-otp",
    element: <Layout>{withSuspense(OTPPage)}</Layout>,
  },
  {
    path: "/forget-password",
    element: <Layout>{withSuspense(ForgetPasswordPage)}</Layout>,
  },
  {
    path: "/reset-password",
    element: <Layout>{withSuspense(ResetPasswordPage)}</Layout>,
  },
  {
    path: "/categories/:slug/:id",
    element: <Layout>{withSuspense(CategoryDetailsPage)}</Layout>,
  },
  {
    path: "/products/:slug/:id",
    element: <Layout>{withSuspense(ProductDetailPage)}</Layout>,
  },
  {
    path: "/products",
    element: <Layout>{withSuspense(ProductsPage)}</Layout>,
  },
  {
    path: "/favorites",
    element: <ProtectedRoute><Layout>{withSuspense(FavoritesPage)}</Layout></ProtectedRoute>,
  },
  {
    path: "/offers",
    element: <Layout>{withSuspense(OffersPage)}</Layout>,
  },
  {
    path: "/offers/:offerId",
    element: <Layout>{withSuspense(OffersDetailsPage)}</Layout>,
  },
  {
    path: "/cart",
    element: <Layout>{withSuspense(CartPage)}</Layout>,
  },
  {
    path: "/checkout",
    element: <ProtectedRoute><Layout>{withSuspense(CheckoutPage)}</Layout></ProtectedRoute>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Layout>{withSuspense(UserDashboard)}</Layout></ProtectedRoute>,
  },
  {
    path: "/dashboard/orders",
    element: <ProtectedRoute><Layout>{withSuspense(UserDashboard)}</Layout></ProtectedRoute>,
  },
  {
    path: "/dashboard/settings",
    element: <ProtectedRoute><Layout>{withSuspense(UserDashboard)}</Layout></ProtectedRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}