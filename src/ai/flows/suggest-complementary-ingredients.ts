import { z } from 'zod';
import { ai } from '@/ai/genkit';

const SuggestComplementaryIngredientsInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of the main ingredients in the recipe.'),
  recipeName: z.string().describe('The name of the recipe.'),
});
export type SuggestComplementaryIngredientsInput = z.infer<
  typeof SuggestComplementaryIngredientsInputSchema
>;

const SuggestComplementaryIngredientsOutputSchema = z.object({
  suggestedCategories: z.array(z.object({
    category: z.string().describe('The category of the suggested ingredients, e.g., "Herbs and Spices", "Vegetables", "Proteins".'),
    items: z.array(z.string()).describe('A list of ingredients in this category.'),
  })).describe('A list of categorized ingredient suggestions.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested ingredients.'),
});
export type SuggestComplementaryIngredientsOutput = z.infer<
  typeof SuggestComplementaryIngredientsOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'suggestComplementaryIngredientsPrompt',
  input: { schema: SuggestComplementaryIngredientsInputSchema },
  output: { schema: SuggestComplementaryIngredientsOutputSchema },
  prompt: `Based on the following ingredients available:
{{{ingredients}}}

And the recipe being considered: {{{recipeName}}}.

Please suggest a list of ingredients that would complement the recipe and explain your reasoning.
Group the suggested ingredients into logical categories such as "Herbs and Spices", "Vegetables", "Proteins", etc.

Output in the following JSON format: {{outputSchema}}`,
});

const suggestComplementaryIngredientsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryIngredientsFlow',
    inputSchema: SuggestComplementaryIngredientsInputSchema,
    outputSchema: SuggestComplementaryIngredientsOutputSchema,
  },
  async (input) => {
    const parsedInput = SuggestComplementaryIngredientsInputSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error(`Invalid input: ${parsedInput.error.errors.map(e => e.message).join(', ')}`);
    }
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error(e);
      throw new Error('Could not generate suggestions.');
    }
  }
);

export async function suggestComplementaryIngredients(
  input: SuggestComplementaryIngredientsInput
): Promise<SuggestComplementaryIngredientsOutput> {
  return suggestComplementaryIngredientsFlow(input);
}
