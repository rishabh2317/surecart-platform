// lib/auth-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveUserSession, getUserSession, clearUserSession } from '@/lib/auth';

const API_BASE_URL = 'http://localhost:3001';

interface AuthContextType {
  user: any;
  loading: boolean; // <-- Add a loading state
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUserSession: (newUser: any) => void; // <-- Add a function to update the session
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Start in a loading state
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // On initial load, check for a user session in localStorage
    const sessionUser = getUserSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false); // Finished loading
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUserSession(data);
    setUser(data);
    if (data.role === 'CREATOR') router.push('/dashboard');
    else router.push('/likes');
  };

  const register = async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUserSession(data);
    setUser(data);
    if (data.role === 'CREATOR') router.push('/onboarding');
    else setAuthModalOpen(false);
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
    router.push('/'); 
  };
  
  // New function to allow components to update the user state after an action like upgrading
  const updateUserSession = (newUser: any) => {
      saveUserSession(newUser);
      setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserSession, isAuthModalOpen, openAuthModal: () => setAuthModalOpen(true), closeAuthModal: () => setAuthModalOpen(false) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};