'use client';
import { useCallback, useMemo } from 'react';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { useUser, useFirestore, useCollection } from '@/firebase';
import type { Recipe, RecipeWithId } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const user = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const favoritesCollection = useMemo(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'favorites');
  }, [user, firestore]);

  const { data: favorites, status } = useCollection(favoritesCollection, {
    key: 'id',
  });

  const isLoaded = status === 'success' || status === 'error';

  const addFavorite = useCallback(
    (recipe: Recipe) => {
      if (!user || !firestore || !favoritesCollection) {
        toast({
          variant: 'destructive',
          title: 'Please log in',
          description: 'You must be logged in to save favorites.',
        });
        return;
      }
      const recipeWithId: RecipeWithId = {
        ...recipe,
        id: recipe.name.toLowerCase().replace(/\s+/g, '-'),
        image:
          'image' in recipe
            ? (recipe as RecipeWithId).image
            : '/placeholder.svg',
        imageHint:
          'imageHint' in recipe ? (recipe as RecipeWithId).imageHint : 'recipe',
      };
      const favRef = doc(favoritesCollection, recipeWithId.id);
      setDoc(favRef, { ...recipeWithId, createdAt: serverTimestamp() })
        .then(() => {
          toast({
            title: 'Recipe Saved!',
            description: `${recipe.name} has been added to your favorites.`,
          });
        })
        .catch((error) => {
          console.error('Error saving favorite:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not save recipe. Please try again.',
          });
        });
    },
    [user, firestore, favoritesCollection, toast]
  );

  const removeFavorite = useCallback(
    (recipeId: string) => {
      if (!user || !firestore || !favoritesCollection) return;
      const favRef = doc(favoritesCollection, recipeId);
      const recipeName = favorites?.find((fav) => fav.id === recipeId)?.name;
      deleteDoc(favRef)
        .then(() => {
          toast({
            title: 'Recipe Removed',
            description: `${recipeName} has been removed from your favorites.`,
          });
        })
        .catch((error) => {
          console.error('Error removing favorite:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not remove recipe. Please try again.',
          });
        });
    },
    [user, firestore, favoritesCollection, toast, favorites]
  );

  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites?.some((fav) => fav.id === recipeId) || false;
    },
    [favorites]
  );

  return {
    favorites: (favorites as RecipeWithId[]) || [],
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoaded,
  };
}
