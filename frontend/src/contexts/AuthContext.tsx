import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register(username, email, password);
      const { user: userData, accessToken } = response.data.data;

      const userInfo: User = {
        id: userData._id,
        username: userData.username,
        email: userData.email,
      };

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setUser(userInfo);

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(identifier, password);
      const { user: userData, accessToken } = response.data.data;

      const userInfo: User = {
        id: userData._id,
        username: userData.username,
        email: userData.email,
      };

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setUser(userInfo);

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
