import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

/**
 * Guards app routes that require an authenticated user.
 * Redirects unauthenticated visitors to /login while preserving
 * the intended destination for post-login redirect.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}

/**
 * Guards auth-only routes (login, register, etc.) so authenticated
 * users are sent to the app instead of seeing the login screen again.
 */
export function RequireGuest() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const target = user && !user.profileCompleted ? '/complete-profile' : '/dashboard';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}
