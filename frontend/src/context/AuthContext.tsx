import { useState, useEffect, type ReactNode } from 'react';
import { api, getApiErrorMessage } from '../api/client';
import type { UserProfile } from '../api/types';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('velmora_user');
      return savedUser ? (JSON.parse(savedUser) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('velmora_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(localStorage.getItem('velmora_token')));

  useEffect(() => {
    if (!token) {
      return;
    }
    let active = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get('/accounts/profile/');
        if (!active) return;
        setUser(res.data);
        localStorage.setItem('velmora_user', JSON.stringify(res.data));
      } catch {
        if (!active) return;
        // Token expired or invalid
        setUser(null);
        setToken(null);
        localStorage.removeItem('velmora_user');
        localStorage.removeItem('velmora_token');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();
    return () => {
      active = false;
    };
  }, [token]);

  const login = async (email: string, password: string, role: string = 'CUSTOMER') => {
    try {
      const res = await api.post('/accounts/login/', { email, password, role });
      const authToken = res.data.token || res.data.access || 'session_authenticated';
      const userData = (res.data.user || res.data) as UserProfile;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('velmora_token', authToken);
      localStorage.setItem('velmora_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err: unknown) {
      return { success: false, error: getApiErrorMessage(err, 'Invalid credentials') };
    }
  };

  const register = async (data: Record<string, string>) => {
    try {
      const res = await api.post('/accounts/register/', data);
      const authToken = res.data.token || res.data.access || 'session_authenticated';
      const userData = (res.data.user || res.data) as UserProfile;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('velmora_token', authToken);
      localStorage.setItem('velmora_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err: unknown) {
      return { success: false, error: getApiErrorMessage(err, 'Registration failed') };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('velmora_token');
    localStorage.removeItem('velmora_user');
  };

  const isAuthenticated = !!user;
  const isProvider = user?.role === 'SERVICE_PROVIDER' || user?.role === 'ADMIN' || !!user?.is_service_provider || !!user?.is_admin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isProvider,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
