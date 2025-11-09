'use client';

import { useState } from 'react';
import type { RecipeWithId } from '@/lib/types';
import { generateRecipesAction } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import FridgeForm from '@/app/components/fridge-form';
import RecipeView from '@/app/components/recipe-view';
import FavoritesView from '@/app/components/favorites-view';
import ShoppingListView from '@/app/components/shopping-list-view';
import ErrorDisplay from '@/app/components/error-display';
import { BookHeart, ChefHat, ShoppingBasket } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastIngredients, setLastIngredients] = useState<string[]>([]);

  const handleGenerateRecipes = async (ingredients: string[]) => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setLastIngredients(ingredients);

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
          };
        }
      );
      setRecipes(recipesWithIds);
    }
    setIsLoading(false);
  };

  const handleRetry = () => {
    handleGenerateRecipes(lastIngredients);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="generator" className="w-full max-w-7xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">
              <ChefHat className="mr-2 h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <BookHeart className="mr-2 h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="shopping-list">
              <ShoppingBasket className="mr-2 h-4 w-4" />
              Shopping List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generator">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <FridgeForm
                  onGenerate={handleGenerateRecipes}
                  isLoading={isLoading}
                />
              </div>
              <div className="lg:col-span-2">
                {error ? (
                  <ErrorDisplay error={error} onRetry={handleRetry} />
                ) : (
                  <RecipeView recipes={recipes} isLoading={isLoading} />
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <FavoritesView />
          </TabsContent>
          <TabsContent value="shopping-list">
            <ShoppingListView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
