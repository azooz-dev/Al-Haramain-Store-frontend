import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to signin page with the intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (isAuthenticated && (location.pathname === '/signin' || location.pathname === '/signup')) {
    // Redirect to home page if user is authenticated and tries to access signin or signup page
    return <Navigate to="/" replace />;
  }

  return <>{ children }</>
}