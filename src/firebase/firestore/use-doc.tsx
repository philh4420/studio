'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';

type DocStatus = 'loading' | 'success' | 'error';

/**
 * Custom hook to subscribe to a Firestore document in real-time.
 */
export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | null
) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<DocStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setStatus('loading');
      setData(null);
      return;
    }

    setStatus('loading');
    setError(null);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id } as T);
          setStatus('success');
        } else {
          setData(null);
          setStatus('success'); // Document doesn't exist, but it's a successful read
        }
      },
      (err) => {
        console.error(`Error listening to document ${docRef.path}:`, err);
        setError(err);
        setStatus('error');
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [docRef]);

  return { data, status, error };
}
