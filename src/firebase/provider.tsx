'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
} from '@/firebase';

// Define the shape of the context value.
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context with a default null value.
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

/**
 * Custom hook to access the Firebase context.
 * Throws an error if used outside of a FirebaseProvider.
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
export function useFirebaseApp() {
  return useFirebase().app;
}
export function useAuth() {
  return useFirebase().auth;
}
export function useFirestore() {
  return useFirebase().firestore;
}

// Define props for the provider component.
interface FirebaseProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes Firebase and makes it available to children.
 */
export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [firebase, setFirebase] = useState<FirebaseContextValue>({
    app: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    // Initialize Firebase services on the client side.
    const app = getFirebaseApp();
    const auth = getFirebaseAuth(app);
    const firestore = getFirebaseFirestore(app);

    setFirebase({ app, auth, firestore });
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}
