'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define User and Auth types
interface UserRole {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const savedUser = JSON.parse(userStr);
        setUser(savedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false); // Stop loading once we check
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}