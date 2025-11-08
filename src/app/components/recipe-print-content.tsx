'use client';

import type { RecipeWithId } from '@/lib/types';
import { Clock, Utensils, Award } from 'lucide-react';


const parseIngredient = (ingredient: string): { quantity: number | null, unit: string, name: string } => {
  const quantityMatch = ingredient.match(/^(\d+\.?\d*)\s*([a-zA-Z]*)\s*(.*)/);
  if (quantityMatch) {
    const [, quantity, unit, name] = quantityMatch;
    return { quantity: parseFloat(quantity), unit: unit.trim(), name: name.trim() };
  }
  return { quantity: null, unit: '', name: ingredient };
};


export default function RecipePrintContent({ recipe }: { recipe: RecipeWithId; }) {
  const originalServings = parseInt(recipe.servings.split(' ')[0]) || 1;
  // For printing, we'll just use the original servings. The adjustment is a UI-only feature.
  const currentServings = originalServings;

  const getAdjustedIngredient = (ingredient: string) => {
    const { quantity, unit, name } = parseIngredient(ingredient);
    if (quantity !== null && originalServings > 0) {
      const newQuantity = (quantity / originalServings) * currentServings;
      const formattedQuantity = newQuantity % 1 === 0 ? newQuantity : newQuantity.toFixed(2);
      return `${formattedQuantity} ${unit} ${name}`;
    }
    return ingredient;
  };

  const instructionsArray = recipe.instructions
    .split(/\d+\.\s/)
    .filter((step) => step.trim() !== '');

  return (
    <div id="printable-content" className="absolute -left-[9999px] p-8 font-sans text-black">
      <h1 className="font-headline text-4xl mb-2">{recipe.name}</h1>
      <p className="text-lg italic text-gray-600 mb-6">{recipe.shortDescription}</p>

      <div className="mb-8 grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
          <Clock className="h-6 w-6" />
          <p className="text-sm font-semibold">Prep</p>
          <p className="text-xs text-gray-600">{recipe.prepTime}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
          <Clock className="h-6 w-6" />
          <p className="text-sm font-semibold">Cook</p>
          <p className="text-xs text-gray-600">{recipe.cookTime}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
          <Utensils className="h-6 w-6" />
          <p className="text-sm font-semibold">Serves</p>
          <span className="text-xs font-bold text-gray-600">{currentServings}</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
          <Award className="h-6 w-6" />
          <p className="text-sm font-semibold">Difficulty</p>
          <p className="text-xs text-gray-600">{recipe.difficulty}</p>
        </div>
      </div>
      
       <div className="mb-8 grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
            <p className="text-sm font-semibold">Cuisine</p>
            <p className="text-xs text-gray-600">{recipe.cuisine}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 p-3">
            <p className="text-sm font-semibold">Calories</p>
            <p className="text-xs text-gray-600">{recipe.calories} kcal</p>
          </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {recipe.ingredients.map((ing) => (
            <li key={ing} className="text-base">{getAdjustedIngredient(ing)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-4 text-base">
          {instructionsArray.map((step, index) => (
            <li key={index} className="leading-relaxed">{step.trim()}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};
