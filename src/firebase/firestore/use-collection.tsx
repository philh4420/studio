'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  type CollectionReference,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseCollectionOptions {
  key?: string; // Field to use as the key for the returned map, defaults to document ID
}

type CollectionStatus = 'loading' | 'success' | 'error';

/**
 * Custom hook to subscribe to a Firestore collection in real-time.
 */
export function useCollection<T extends DocumentData>(
  collectionRef: CollectionReference<T> | Query<T> | null,
  options?: UseCollectionOptions
) {
  const [data, setData] = useState<T[] | null>(null);
  const [status, setStatus] = useState<CollectionStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionRef) {
      setStatus('loading');
      setData(null);
      return;
    }

    setStatus('loading');
    setError(null);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const keyField = options?.key || 'id';
          return {
            ...docData,
            [keyField]: doc.id,
          };
        });
        setData(docs as T[]);
        setStatus('success');
      },
      (err) => {
        console.error('Error listening to collection:', err);
        setError(err);
        setStatus('error');
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionRef, options?.key]);

  return { data, status, error };
}

/**
 * Memoizes a Firestore query or collection reference to prevent re-renders.
 */
export function useMemoFirebase<T>(
  factory: () => T,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
