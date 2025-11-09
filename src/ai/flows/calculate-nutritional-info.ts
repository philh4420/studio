import { z } from 'zod';
import { ai } from '@/ai/genkit';

const NutritionalInfoInputSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    servings: z.number(),
  }),
});
export type NutritionalInfoInput = z.infer<typeof NutritionalInfoInputSchema>;

const NutritionalInfoOutputSchema = z.object({
  calories: z.number().describe('Estimated calories per serving.'),
  protein: z.number().describe('Estimated grams of protein per serving.'),
  carbs: z.number().describe('Estimated grams of carbohydrates per serving.'),
  fat: z.number().describe('Estimated grams of fat per serving.'),
});
export type NutritionalInfoOutput = z.infer<typeof NutritionalInfoOutputSchema>;

const prompt = ai.definePrompt({
  name: 'nutritionalInfoPrompt',
  input: { schema: NutritionalInfoInputSchema },
  output: { schema: NutritionalInfoOutputSchema },
  prompt: `You are a nutritional expert. Based on the following recipe, estimate the nutritional information per serving.

Recipe Name: {{{recipe.name}}}
Ingredients: {{{recipe.ingredients}}}
Servings: {{{recipe.servings}}}

Please provide the estimated calories, protein, carbs, and fat per serving.

Output in the following JSON format: {{outputSchema}}`,
});

const calculateNutritionalInfoFlow = ai.defineFlow(
  {
    name: 'calculateNutritionalInfoFlow',
    inputSchema: NutritionalInfoInputSchema,
    outputSchema: NutritionalInfoOutputSchema,
  },
  async (input) => {
    const parsedInput = NutritionalInfoInputSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error(`Invalid input: ${parsedInput.error.errors.map(e => e.message).join(', ')}`);
    }
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error(e);
      throw new Error('Could not calculate nutritional information.');
    }
  }
);

export async function calculateNutritionalInfo(
  input: NutritionalInfoInput
): Promise<NutritionalInfoOutput> {
  return calculateNutritionalInfoFlow(input);
}
