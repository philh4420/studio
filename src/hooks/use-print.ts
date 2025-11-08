
'use client';

import { create } from 'zustand';
import type { RecipeWithId } from '@/lib/types';

interface PrintState {
  recipeToPrint: RecipeWithId | null;
  setRecipeToPrint: (recipe: RecipeWithId | null) => void;
}

export const usePrintStore = create<PrintState>((set) => ({
  recipeToPrint: null,
  setRecipeToPrint: (recipe) => set({ recipeToPrint: recipe }),
}));
