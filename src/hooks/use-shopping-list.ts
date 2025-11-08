'use client';
import { useCallback, useMemo } from 'react';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  writeBatch,
} from 'firebase/firestore';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export function useShoppingList() {
  const user = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const shoppingListCollection = useMemo(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'shoppingList');
  }, [user, firestore]);

  const { data, status } = useCollection(shoppingListCollection, {
    key: 'name',
  });

  const shoppingList: string[] = useMemo(() => {
    if (!data) return [];
    return data.map((item) => item.name);
  }, [data]);

  const isLoaded = status === 'success' || status === 'error';

  const addIngredient = useCallback(
    (ingredient: string) => {
      if (!user || !firestore || !shoppingListCollection) {
        toast({
          variant: 'destructive',
          title: 'Please log in',
          description: 'You must be logged in to add to your shopping list.',
        });
        return;
      }
      if (shoppingList.includes(ingredient)) {
        toast({
          variant: 'destructive',
          title: 'Already on List',
          description: `${ingredient} is already on your shopping list.`,
        });
        return;
      }

      const ingredientId = ingredient.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
      const itemRef = doc(shoppingListCollection, ingredientId);

      setDoc(itemRef, { name: ingredient })
        .then(() => {
          toast({
            title: 'Ingredient Added!',
            description: `${ingredient} has been added to your shopping list.`,
          });
        })
        .catch((error) => {
          console.error('Error adding to shopping list:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not add ingredient. Please try again.',
          });
        });
    },
    [user, firestore, shoppingListCollection, shoppingList, toast]
  );

  const removeIngredient = useCallback(
    (ingredient: string) => {
      if (!user || !firestore || !shoppingListCollection) return;
      const ingredientId = ingredient.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
      const itemRef = doc(shoppingListCollection, ingredientId);

      deleteDoc(itemRef)
        .then(() => {
          toast({
            title: 'Ingredient Removed',
            description: `${ingredient} has been removed from your list.`,
          });
        })
        .catch((error) => {
          console.error('Error removing from shopping list:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not remove ingredient. Please try again.',
          });
        });
    },
    [user, firestore, shoppingListCollection, toast]
  );

  const clearList = useCallback(async () => {
    if (!user || !firestore || !data) return;

    const batch = writeBatch(firestore);
    data.forEach((item) => {
      const ingredientId = (item.name as string).toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
      const itemRef = doc(firestore, 'users', user.uid, 'shoppingList', ingredientId);
      batch.delete(itemRef);
    });

    try {
      await batch.commit();
      toast({
        title: 'Shopping List Cleared',
      });
    } catch (error) {
      console.error('Error clearing shopping list:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear the shopping list. Please try again.',
      });
    }
  }, [user, firestore, data, toast]);

  const isInList = useCallback(
    (ingredient: string) => {
      return shoppingList.some((item) => item === ingredient);
    },
    [shoppingList]
  );

  return {
    shoppingList,
    addIngredient,
    removeIngredient,
    clearList,
    isInList,
    isLoaded,
  };
}
