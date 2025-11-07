'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RecipeWithId } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const FAVORITES_KEY = 'fridge-genie-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<RecipeWithId[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const updateLocalStorage = (updatedFavorites: RecipeWithId[]) => {
    try {
      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  };

  const addFavorite = useCallback(
    (recipe: RecipeWithId) => {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      updateLocalStorage(newFavorites);
      toast({
        title: 'Recipe Saved!',
        description: `${recipe.name} has been added to your favorites.`,
      });
    },
    [favorites, toast]
  );

  const removeFavorite = useCallback(
    (recipeId: string) => {
      const recipeName = favorites.find((fav) => fav.id === recipeId)?.name;
      const newFavorites = favorites.filter((fav) => fav.id !== recipeId);
      setFavorites(newFavorites);
      updateLocalStorage(newFavorites);
      toast({
        title: 'Recipe Removed',
        description: `${recipeName} has been removed from your favorites.`,
      });
    },
    [favorites, toast]
  );

  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites.some((fav) => fav.id === recipeId);
    },
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, isLoaded };
}
