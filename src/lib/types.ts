import { generateRecipesFromIngredients } from '@/ai/flows/generate-recipes-from-ingredients';

export type Recipe = Awaited<
  ReturnType<typeof generateRecipesFromIngredients>
>['recipes'][number];

export type RecipeWithId = Recipe & {
  id: string;
  image: string;
  imageHint: string;
};

export type ShoppingListItem = {
  name: string;
};
