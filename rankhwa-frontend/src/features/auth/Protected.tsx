import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.store';

/**
 * A component that guards its children, redirecting unauthenticated
 * users to the login page.  While the auth state is loading it
 * renders nothing to prevent flicker.  The redirect includes the
 * current pathname so that the user can continue where they left off
 * after logging in.
 */
export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }
  return <>{children}</>;
};