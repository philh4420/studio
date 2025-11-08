'use client';

import { useFavorites } from '@/hooks/use-favorites';
import RecipeList from './recipe-list';
import { Skeleton } from '@/components/ui/skeleton';
import { BookHeart, User } from 'lucide-react';
import { useUser } from '@/firebase';

export default function FavoritesView() {
  const user = useUser();
  const { favorites, isLoaded } = useFavorites();

  if (!user) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Please Log In</h3>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in to see your favorite recipes.
        </p>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <BookHeart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Favorite Recipes</h3>
        <p className="mt-2 text-muted-foreground">
          You haven't saved any recipes yet. Find a recipe you like and click the heart to save it!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <RecipeList recipes={favorites} isFavoritesList={true} />
    </div>
  );
}
