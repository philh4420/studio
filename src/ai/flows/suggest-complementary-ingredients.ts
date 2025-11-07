'use server';

/**
 * @fileOverview Suggests complementary ingredients to improve a recipe.
 *
 * - suggestComplementaryIngredients - A function that suggests ingredients.
 * - SuggestComplementaryIngredientsInput - The input type for the suggestComplementaryIngredients function.
 * - SuggestComplementaryIngredientsOutput - The return type for the suggestComplementaryIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestComplementaryIngredientsInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients currently available.'),
  recipeName: z.string().describe('The name of the recipe being considered.'),
});
export type SuggestComplementaryIngredientsInput = z.infer<
  typeof SuggestComplementaryIngredientsInputSchema
>;

const SuggestComplementaryIngredientsOutputSchema = z.object({
  suggestedIngredients: z
    .array(z.string())
    .describe('A list of ingredients that would complement the recipe.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested ingredients.'),
  error: z.string().optional(),
});
export type SuggestComplementaryIngredientsOutput = z.infer<
  typeof SuggestComplementaryIngredientsOutputSchema
>;

export async function suggestComplementaryIngredients(
  input: SuggestComplementaryIngredientsInput
): Promise<SuggestComplementaryIngredientsOutput> {
  return suggestComplementaryIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplementaryIngredientsPrompt',
  input: {schema: SuggestComplementaryIngredientsInputSchema},
  output: {schema: SuggestComplementaryIngredientsOutputSchema},
  prompt: `Based on the following ingredients available:
{{{ingredients}}}

And the recipe being considered: {{{recipeName}}}.

Please suggest a list of ingredients that would complement the recipe and explain your reasoning.`,
});

const suggestComplementaryIngredientsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryIngredientsFlow',
    inputSchema: SuggestComplementaryIngredientsInputSchema,
    outputSchema: SuggestComplementaryIngredientsOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output!;
    } catch(e) {
        console.error(e);
        return { suggestedIngredients: [], reasoning: '', error: 'Could not generate suggestions.'}
    }
  }
);
