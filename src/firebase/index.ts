'use client';
// This file is the single entrypoint for all Firebase-related modules.

export * from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
export { firebaseConfig } from './config';
