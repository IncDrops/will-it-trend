
'use client';

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // If no user, sign them in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">
                Initializing Session...
                </h1>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
