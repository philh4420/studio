'use server';

import {
  generateRecipesFromIngredients,
  GenerateRecipesFromIngredientsInput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import {
  suggestComplementaryIngredients,
  SuggestComplementaryIngredientsInput,
} from '@/ai/flows/suggest-complementary-ingredients';
import {
  makeRecipeHealthier,
  MakeRecipeHealthierInput,
} from '@/ai/flows/make-recipe-healthier';

export async function generateRecipesAction(
  input: GenerateRecipesFromIngredientsInput
) {
  try {
    const result = await generateRecipesFromIngredients(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate recipes. Please try again.' };
  }
}

export async function getComplementaryIngredientsAction(
  input: SuggestComplementaryIngredientsInput
) {
  try {
    const result = await suggestComplementaryIngredients(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to suggest ingredients. Please try again.' };
  }
}

export async function makeRecipeHealthierAction(
  input: MakeRecipeHealthierInput
) {
  try {
    const result = await makeRecipeHealthier(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate health suggestions. Please try again.' };
  }
}

export async function complementaryIngredients(input: SuggestComplementaryIngredientsInput) {
    try {
        const result = await suggestComplementaryIngredients(input);
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to suggest ingredients. Please try again.' };
    }
}
