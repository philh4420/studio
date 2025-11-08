'use server';

/**
 * @fileOverview Suggests healthier alternatives for a given recipe.
 *
 * - makeRecipeHealthier - A function that suggests healthier recipe modifications.
 * - MakeRecipeHealthierInput - The input type for the makeRecipeHealthier function.
 * - MakeRecipeHealthierOutput - The return type for the makeRecipeHealthier function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Recipe } from '@/lib/types';

const MakeRecipeHealthierInputSchema = z.object({
  recipe: z.object({
    name: z.string(),
    shortDescription: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.string(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    cuisine: z.string(),
    calories: z.number(),
    ingredients: z.array(z.string()),
    instructions: z.string(),
  }),
});
export type MakeRecipeHealthierInput = z.infer<
  typeof MakeRecipeHealthierInputSchema
>;

const MakeRecipeHealthierOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        originalIngredient: z.string().describe('The original ingredient to replace.'),
        healthierAlternative: z.string().describe('The suggested healthier alternative.'),
        reasoning: z.string().describe('Why this alternative is healthier.'),
      })
    )
    .describe('A list of suggestions for making the recipe healthier.'),
  generalTips: z.string().describe('General tips for a healthier preparation of this recipe.'),
});
export type MakeRecipeHealthierOutput = z.infer<
  typeof MakeRecipeHealthierOutputSchema
>;

export async function makeRecipeHealthier(
  input: MakeRecipeHealthierInput
): Promise<MakeRecipeHealthierOutput> {
  return makeRecipeHealthierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'makeRecipeHealthierPrompt',
  input: { schema: MakeRecipeHealthierInputSchema },
  output: { schema: MakeRecipeHealthierOutputSchema },
  prompt: `You are a nutritionist bot. Given the following recipe, suggest healthier alternatives for its ingredients and preparation.

Recipe Name: {{{recipe.name}}}
Ingredients: {{{recipe.ingredients}}}
Instructions: {{{recipe.instructions}}}

Please provide specific ingredient substitutions and general tips for making this recipe healthier. Focus on reducing calories, fat, and sodium, while increasing nutrients.

Output in the following JSON format: {{outputSchema}}`,
});

const makeRecipeHealthierFlow = ai.defineFlow(
  {
    name: 'makeRecipeHealthierFlow',
    inputSchema: MakeRecipeHealthierInputSchema,
    outputSchema: MakeRecipeHealthierOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
