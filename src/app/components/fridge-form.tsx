'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateRecipesAction } from '@/app/actions';
import type { RecipeWithId } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Loader2, Refrigerator, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  ingredient: z.string().min(2, 'Ingredient must be at least 2 characters.'),
});

interface FridgeFormProps {
  setRecipes: (recipes: RecipeWithId[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export default function FridgeForm({
  setRecipes,
  setIsLoading,
  setError,
}: FridgeFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Cheese', 'Basil']);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newIngredient = values.ingredient.trim();
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
      form.reset();
    }
  }

  function removeIngredient(ingredientToRemove: string) {
    setIngredients(ingredients.filter((i) => i !== ingredientToRemove));
  }

  function clearIngredients() {
    setIngredients([]);
  }

  async function handleGenerateRecipes() {
    if (ingredients.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Ingredients',
        description: 'Please add some ingredients from your fridge first.',
      });
      return;
    }
    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    setRecipes([]);

    const result = await generateRecipesAction({ ingredients });

    if (result.error) {
      setError(result.error);
    } else if (result.recipes) {
      const recipesWithIds: RecipeWithId[] = result.recipes.map(
        (recipe, index) => {
          const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
          return {
          ...recipe,
          id: `${new Date().getTime()}-${index}`,
          image: placeholder.imageUrl,
          imageHint: placeholder.imageHint,
        }}
      );
      setRecipes(recipesWithIds);
    }

    setIsLoading(false);
    setIsGenerating(false);
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Refrigerator className="h-6 w-6" />
          My Fridge
        </CardTitle>
        <CardDescription>
          Add the ingredients you have on hand, and we&apos;ll suggest some recipes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="ingredient"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="e.g., Chicken breast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary">Add</Button>
          </form>
        </Form>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground">
              Available Ingredients:
            </h3>
            {ingredients.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearIngredients}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="text-md bg-accent/30 py-1 pl-3 pr-1"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-2 rounded-full p-0.5 hover:bg-destructive/50"
                    aria-label={`Remove ${ingredient}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Your fridge is empty!
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleGenerateRecipes}
          disabled={isGenerating}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Recipes
        </Button>
      </CardContent>
    </Card>
  );
}
