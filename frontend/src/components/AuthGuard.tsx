import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { toast } from 'sonner';

const DeniedRedirect: React.FC<{ message: string; to: string }> = ({ message, to }) => {
  useEffect(() => {
    toast.error(message);
  }, [message]);

  return <Navigate to={to} replace />;
};

/**
 * RequireAuth: Protects client-only routes (/profile, /cart, /checkout).
 * Unauthenticated users are redirected directly to /login.
 */
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37' }}>
          Verifying Atelier Authentication...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

/**
 * RequireAdmin: Protects store management & atelier operations (/admin).
 */
export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37' }}>
          Verifying Administrator Privileges...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const isAdmin = user?.role === 'ADMIN' || !!user?.is_admin || !!user?.is_staff || !!user?.is_superuser;

  if (!isAdmin) {
    return <DeniedRedirect message="Access restricted. Store Administrator credentials required." to="/profile" />;
  }

  return <>{children}</>;
};

/**
 * RequireProvider: Protects atelier provider operations (/provider/dashboard, /provider-dashboard).
 */
export const RequireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37' }}>
          Verifying Provider Privileges...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const isAuthorized =
    user?.role === 'ADMIN' ||
    user?.role === 'SERVICE_PROVIDER' ||
    !!user?.is_admin ||
    !!user?.is_service_provider ||
    !!user?.is_staff ||
    !!user?.is_superuser;

  if (!isAuthorized) {
    return <DeniedRedirect message="Access restricted. Authorized Atelier Provider credentials required." to="/profile" />;
  }

  return <>{children}</>;
};
