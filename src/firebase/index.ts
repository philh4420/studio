'use client';
import {
  type FirebaseApp,
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

// Provides a singleton pattern for getting the Firebase app instance.
function getFirebaseApp(config = firebaseConfig): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(config);
}

// Convenience wrappers for getting specific Firebase services.
function getFirebaseAuth(config = firebaseConfig): Auth {
  return getAuth(getFirebaseApp(config));
}

function getFirebaseFirestore(config = firebaseConfig): Firestore {
  return getFirestore(getFirebaseApp(config));
}

export { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore };

export {
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
