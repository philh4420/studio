'use client';

import type { RecipeWithId } from '@/lib/types';
import RecipeList from './recipe-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed, AlertTriangle } from 'lucide-react';

interface RecipeViewProps {
  recipes: RecipeWithId[];
  isLoading: boolean;
  error: string | null;
}

function RecipeSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export default function RecipeView({
  recipes,
  isLoading,
  error,
}: RecipeViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <RecipeSkeleton />
        <RecipeSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Recipes Yet</h3>
        <p className="mt-2 text-muted-foreground">
          Add some ingredients and click "Generate Recipes" to get started!
        </p>
      </div>
    );
  }

  return <RecipeList recipes={recipes} />;
}
