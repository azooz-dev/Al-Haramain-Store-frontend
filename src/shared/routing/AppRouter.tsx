import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/layout";
import { SignInPage } from "@/features/auth/components/SignInPage";
import { SignUpPage } from "@/features/auth/components/SignUpPage";
import { OTPPage } from "@/features/auth/components/OTPPage";

// Create a simple home page component
const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Al-Haramain Islamic E-commerce
      </h1>
      <p className="text-center text-muted-foreground">Your trusted source for Islamic products</p>
    </div>
  );
}
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
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/verify-otp",
    element: <OTPPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}