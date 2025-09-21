
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { mockUser as defaultMockUser } from '@/lib/data';
import type { User } from '@/lib/types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  onboardingComplete: boolean; // Mock state for onboarding
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, onboardingComplete: false, updateUser: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication. User is always logged in.
  useEffect(() => {
    // We simulate fetching the user from a DB
    setTimeout(() => {
        setUser(defaultMockUser);
        setLoading(false);
    }, 500);
  }, []);
  
  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }

  const onboardingComplete = true; 

  return (
    <AuthContext.Provider value={{ user, loading, onboardingComplete, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
