import { generateRecipesFromIngredients } from '@/ai/flows/generate-recipes-from-ingredients';
import { NutritionalInfoOutput } from '@/ai/flows/calculate-nutritional-info';

export type Recipe = Awaited<
  ReturnType<typeof generateRecipesFromIngredients>
>['recipes'][number];

export type RecipeWithId = Recipe & {
  id: string;
  image: string;
  imageHint: string;
  nutritionalInfo?: NutritionalInfoOutput;
};

export type ShoppingListItem = {
  name: string;
};
