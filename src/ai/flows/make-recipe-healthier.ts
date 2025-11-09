import { z } from 'zod';
import { ai } from '@/ai/genkit';

const MakeRecipeHealthierInputSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.string(),
  }),
});
export type MakeRecipeHealthierInput = z.infer<typeof MakeRecipeHealthierInputSchema>;

const MakeRecipeHealthierOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      originalIngredient: z.string(),
      healthierAlternative: z.string(),
      reasoning: z.string(),
    })
  ),
  generalTips: z.string(),
});
export type MakeRecipeHealthierOutput = z.infer<typeof MakeRecipeHealthierOutputSchema>;

const prompt = ai.definePrompt({
  name: 'makeRecipeHealthierPrompt',
  input: { schema: MakeRecipeHealthierInputSchema },
  output: { schema: MakeRecipeHealthierOutputSchema },
  prompt: `You are a health-conscious recipe assistant. Given the following recipe, suggest ways to make it healthier. Provide specific ingredient swaps and general tips.

Recipe Name: {{{recipe.name}}}
Ingredients: {{{recipe.ingredients}}}
Instructions: {{{recipe.instructions}}}

Output in the following JSON format: {{outputSchema}}
`,
});

const makeRecipeHealthierFlow = ai.defineFlow(
  {
    name: 'makeRecipeHealthierFlow',
    inputSchema: MakeRecipeHealthierInputSchema,
    outputSchema: MakeRecipeHealthierOutputSchema,
  },
  async (input) => {
    const parsedInput = MakeRecipeHealthierInputSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error(`Invalid input: ${parsedInput.error.errors.map(e => e.message).join(', ')}`);
    }
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error(e);
      throw new Error('Could not generate health suggestions.');
    }
  }
);

export async function makeRecipeHealthier(
  input: MakeRecipeHealthierInput
): Promise<MakeRecipeHealthierOutput> {
  return makeRecipeHealthierFlow(input);
}
