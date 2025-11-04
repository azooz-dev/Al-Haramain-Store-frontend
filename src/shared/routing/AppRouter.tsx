import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/layout";
import { SignInPage } from "@/features/auth/components/SignInPage";
import { SignUpPage } from "@/features/auth/components/SignUpPage";
import { OTPPage } from "@/features/auth/components/OTPPage";
import { ForgetPasswordPage } from "@/features/auth/components/ForgetPasswordPage";
import { ResetPasswordPage } from "@/features/auth/components/ResetPasswordPage";
import { ProductDetailPage } from "@/features/products/components/pages/ProductDetailPage";
import { ProductsPage } from "@/features/products/components/pages/ProductsPage";
import { CategoryDetailsPage } from "@/features/categories/components/CategoryDetailsPage";
import { FavoritesPage } from "@/features/favorites/components/FavoritesPage";
import { OffersPage } from "@/features/offers/components/OffersPage";
import { OffersDetailsPage } from "@/features/offers/components/OffersDetailsPage";
import { HomePage } from "@/features/home/components/HomePage";
import { AboutPage } from "@/features/home/components/AboutPage";
import { ContactPage } from "@/features/home/components/ContactPage";
import { CartPage } from "@/features/cart/components/CartPage";
import { CheckoutPage } from "@/features/orders/components/CheckoutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: <Layout><AboutPage /></Layout>,
  },
  {
    path: "/contact",
    element: <Layout><ContactPage /></Layout>,
  },
  {
    path: "/signin",
    element: <Layout><SignInPage /></Layout>,
  },
  {
    path: "/signup",
    element: <Layout><SignUpPage /></Layout>,
  },
  {
    path: "/verify-otp",
    element: <Layout><OTPPage /></Layout>,
  },
  {
    path: "/forget-password",
    element: <Layout><ForgetPasswordPage /></Layout>,
  },
  {
    path: "/reset-password",
    element: <Layout><ResetPasswordPage /></Layout>,
  },
  {
    path: "/categories/:slug/:id",
    element: <Layout><CategoryDetailsPage /></Layout>,
  },
  {
    path: "/products/:slug/:id",
    element: <Layout><ProductDetailPage /></Layout>,
  },
  {
    path: "/products",
    element: <Layout><ProductsPage /></Layout>,
  },
  {
    path: "/favorites",
    element: <Layout><FavoritesPage /></Layout>,
  },
  {
    path: "/offers",
    element: <Layout><OffersPage /></Layout>,
  },
  {
    path: "/offers/:offerId",
    element: <Layout><OffersDetailsPage /></Layout>,
  },
  {
    path: "/cart",
    element: <Layout><CartPage /></Layout>,
  },
  {
    path: "/checkout",
    element: <Layout><CheckoutPage /></Layout>,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}