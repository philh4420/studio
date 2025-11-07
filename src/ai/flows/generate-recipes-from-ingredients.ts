'use server';

/**
 * @fileOverview Generates recipe suggestions based on user-provided ingredients.
 *
 * - generateRecipesFromIngredients - A function that takes a list of ingredients and returns recipe suggestions.
 * - GenerateRecipesFromIngredientsInput - The input type for the generateRecipesFromIngredients function.
 * - GenerateRecipesFromIngredientsOutput - The return type for the generateRecipesFromIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipesFromIngredientsInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients available in the fridge.'),
});
export type GenerateRecipesFromIngredientsInput = z.infer<
  typeof GenerateRecipesFromIngredientsInputSchema
>;

const GenerateRecipesFromIngredientsOutputSchema = z.object({
  recipes: z
    .array(
      z.object({
        name: z.string().describe('The name of the recipe.'),
        shortDescription: z
          .string()
          .describe('A short, enticing description of the recipe.'),
        prepTime: z.string().describe("The preparation time, e.g., '15 minutes'."),
        cookTime: z.string().describe("The cooking time, e.g., '25 minutes'."),
        servings: z.string().describe("The number of servings, e.g., '4 people'."),
        difficulty: z
          .enum(['Easy', 'Medium', 'Hard'])
          .describe('The difficulty level of the recipe.'),
        cuisine: z.string().describe('The type of cuisine, e.g., Italian, Mexican.'),
        calories: z.number().describe('The estimated number of calories per serving.'),
        ingredients: z
          .array(z.string())
          .describe('The ingredients required for the recipe.'),
        instructions: z.string().describe('The instructions for the recipe.'),
      })
    )
    .describe('A list of 10 recipe suggestions.'),
});
export type GenerateRecipesFromIngredientsOutput = z.infer<
  typeof GenerateRecipesFromIngredientsOutputSchema
>;

export async function generateRecipesFromIngredients(
  input: GenerateRecipesFromIngredientsInput
): Promise<GenerateRecipesFromIngredientsOutput> {
  return generateRecipesFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesFromIngredientsPrompt',
  input: {schema: GenerateRecipesFromIngredientsInputSchema},
  output: {schema: GenerateRecipesFromIngredientsOutputSchema},
  prompt: `You are a recipe suggestion bot. Given the following ingredients, suggest 10 recipes that can be made.

Ingredients: {{{ingredients}}}

Please provide a list of recipes with all the requested details.

Output in the following JSON format: {{outputSchema}}`,
});

const generateRecipesFromIngredientsFlow = ai.defineFlow(
  {
    name: 'generateRecipesFromIngredientsFlow',
    inputSchema: GenerateRecipesFromIngredientsInputSchema,
    outputSchema: GenerateRecipesFromIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
