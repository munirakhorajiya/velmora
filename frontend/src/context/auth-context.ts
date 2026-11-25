import { createContext, useContext } from 'react';
import type { UserProfile } from '../api/types';

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (data: Record<string, string>) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isProvider: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
