'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

/**
 * Custom hook to get the current authenticated user.
 * Returns the user object, null if not logged in, or undefined while loading.
 */
export function useUser(): User | null | undefined {
  const auth = useAuth();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!auth) {
      setUser(undefined); // Auth service not yet available
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setUser(null);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return user;
}
