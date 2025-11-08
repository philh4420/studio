'use client';

import { useState } from 'react';
import type { RecipeWithId } from '@/lib/types';
import RecipeCard from './recipe-card';
import RecipeDetails from './recipe-details';

interface RecipeListProps {
  recipes: RecipeWithId[];
  isFavoritesList?: boolean;
}

export default function RecipeList({ recipes, isFavoritesList = false }: RecipeListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithId | null>(null);

  const handleSelectRecipe = (recipe: RecipeWithId) => {
    setSelectedRecipe(recipe);
  };
  
  const handleClose = () => {
    setSelectedRecipe(null);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelectRecipe={handleSelectRecipe}
          />
        ))}
      </div>
      <RecipeDetails 
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={handleClose}
      />
    </>
  );
}
