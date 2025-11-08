'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const SHOPPING_LIST_KEY = 'fridge-genie-shopping-list';

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(SHOPPING_LIST_KEY);
      if (item) {
        setShoppingList(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load shopping list from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const updateLocalStorage = (updatedList: string[]) => {
    try {
      window.localStorage.setItem(
        SHOPPING_LIST_KEY,
        JSON.stringify(updatedList)
      );
    } catch (error) {
      console.error('Failed to save shopping list to localStorage', error);
    }
  };

  const addIngredient = useCallback(
    (ingredient: string) => {
      if (shoppingList.includes(ingredient)) {
        toast({
          variant: 'destructive',
          title: 'Already on List',
          description: `${ingredient} is already on your shopping list.`,
        });
        return;
      }
      const newList = [...shoppingList, ingredient];
      setShoppingList(newList);
      updateLocalStorage(newList);
      toast({
        title: 'Ingredient Added!',
        description: `${ingredient} has been added to your shopping list.`,
      });
    },
    [shoppingList, toast]
  );

  const removeIngredient = useCallback(
    (ingredient: string) => {
      const newList = shoppingList.filter((item) => item !== ingredient);
      setShoppingList(newList);
      updateLocalStorage(newList);
      toast({
        title: 'Ingredient Removed',
        description: `${ingredient} has been removed from your list.`,
      });
    },
    [shoppingList, toast]
  );

  const clearList = useCallback(() => {
    setShoppingList([]);
    updateLocalStorage([]);
    toast({
      title: 'Shopping List Cleared',
    });
  }, [toast]);
  
  const isInList = useCallback(
    (ingredient: string) => {
      return shoppingList.some((item) => item === ingredient);
    },
    [shoppingList]
  );

  return { shoppingList, addIngredient, removeIngredient, clearList, isInList, isLoaded };
}
