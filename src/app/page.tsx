'use client';

import { useState, useEffect } from 'react';
import type { RecipeWithId } from '@/lib/types';
import { usePrintStore } from '@/hooks/use-print';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import FridgeForm from '@/app/components/fridge-form';
import RecipeView from '@/app/components/recipe-view';
import FavoritesView from '@/app/components/favorites-view';
import { BookMarked, ChefHat } from 'lucide-react';
import RecipePrintContent from './components/recipe-print-content';

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipeToPrint = usePrintStore((state) => state.recipeToPrint);
  const setRecipeToPrint = usePrintStore((state) => state.setRecipeToPrint);

  useEffect(() => {
    if (recipeToPrint) {
      window.print();
      setRecipeToPrint(null); // Reset after queuing print
    }
  }, [recipeToPrint, setRecipeToPrint]);


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="generator" className="w-full max-w-6xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">
              <ChefHat className="mr-2 h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <BookMarked className="mr-2 h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generator">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <FridgeForm
                  setRecipes={setRecipes}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              </div>
              <div className="lg:col-span-2">
                <RecipeView
                  recipes={recipes}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <FavoritesView />
          </TabsContent>
        </Tabs>
      </main>
      {recipeToPrint && <RecipePrintContent recipe={recipeToPrint} />}
    </div>
  );
}
