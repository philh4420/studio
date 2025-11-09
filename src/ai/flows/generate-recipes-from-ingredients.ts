import { z } from 'zod';
import { ai } from '@/ai/genkit';

const StepsSchema = z.object({
  step: z.number().describe('The step number, starting from 1.'),
  description: z.string().describe('The description of the step.'),
});

const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A short description of the recipe.'),
  ingredients: z
    .array(z.string())
    .describe(
      'A list of ingredients required for the recipe. This should include all ingredients, not just the ones available.'
    ),
  steps: z
    .array(StepsSchema)
    .describe(
      'A list of steps to follow to prepare the recipe. This should be a comprehensive list of steps.'
    ),
  servings: z.number().describe('The number of servings the recipe makes.'),
  time: z
    .string()
    .describe(
      'The time it takes to prepare the recipe, in a friendly format (e.g., 20 minutes).'
    ),
  imageHint: z
    .string()
    .describe('A short description of the image content.'),
});

const GenerateRecipesFromIngredientsInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .min(1, 'At least one ingredient is required.')
    .describe('A list of ingredients currently available in the fridge.'),
});
export type GenerateRecipesFromIngredientsInput = z.infer<
  typeof GenerateRecipesFromIngredientsInputSchema
>;

const GenerateRecipesFromIngredientsOutputSchema = z.object({
  recipes: z.array(RecipeSchema),
});
export type GenerateRecipesFromIngredientsOutput = z.infer<
  typeof GenerateRecipesFromIngredientsOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateRecipesFromIngredientsPrompt',
  input: { schema: GenerateRecipesFromIngredientsInputSchema },
  output: { schema: GenerateRecipesFromIngredientsOutputSchema },
  prompt: `You are a recipe suggestion bot. Given the following ingredients, suggest 10 recipes that can be made.
  
  Ingredients: {{{ingredients}}}
  
  Please provide a list of recipes with all the requested details.
  
  Output in the following JSON format: {{outputSchema}}
  `,
});

const generateRecipesFromIngredientsFlow = ai.defineFlow(
  {
    name: 'generateRecipesFromIngredientsFlow',
    inputSchema: GenerateRecipesFromIngredientsInputSchema,
    outputSchema: GenerateRecipesFromIngredientsOutputSchema,
  },
  async (input) => {
    const parsedInput = GenerateRecipesFromIngredientsInputSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error(`Invalid input: ${parsedInput.error.errors.map(e => e.message).join(', ')}`);
    }
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error(e);
      throw new Error('Could not generate recipes.');
    }
  }
);

export async function generateRecipesFromIngredients(
  input: GenerateRecipesFromIngredientsInput
): Promise<GenerateRecipesFromIngredientsOutput> {
  return generateRecipesFromIngredientsFlow(input);
}
