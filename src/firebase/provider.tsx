'use client';
import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase services directly in this file.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

// Define the shape of the context value.
interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Create the context.
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

/**
 * Provider component that makes the initialized Firebase services available to children.
 */
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = { app, auth, firestore };
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

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

// Custom hooks to access individual Firebase services.
export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}
