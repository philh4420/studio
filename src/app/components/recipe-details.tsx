'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { RecipeWithId } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { getComplementaryIngredientsAction } from '@/app/actions';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Heart, Lightbulb, Loader2, Printer, Clock, Utensils, Award, Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RecipeDetailsProps {
  recipe: RecipeWithId | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Complementary {
  suggestedIngredients: string[];
  reasoning: string;
}

// Simple function to parse ingredient quantities
const parseIngredient = (ingredient: string): { quantity: number | null, unit: string, name: string } => {
  const quantityMatch = ingredient.match(/^(\d+\.?\d*)\s*([a-zA-Z]*)\s*(.*)/);
  if (quantityMatch) {
    const [, quantity, unit, name] = quantityMatch;
    return { quantity: parseFloat(quantity), unit: unit.trim(), name: name.trim() };
  }
  return { quantity: null, unit: '', name: ingredient };
};

export default function RecipeDetails({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailsProps) {
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
  const [complementary, setComplementary] = useState<Complementary | null>(null);
  const [isLoadingComplementary, setIsLoadingComplementary] = useState(false);
  
  const originalServings = recipe ? parseInt(recipe.servings.split(' ')[0]) : 1;
  const [currentServings, setCurrentServings] = useState(originalServings);

  useEffect(() => {
    if (recipe) {
      setCurrentServings(parseInt(recipe.servings.split(' ')[0]) || 1);
    }
  }, [recipe]);


  useEffect(() => {
    if (recipe && isOpen) {
      const fetchComplementary = async () => {
        setIsLoadingComplementary(true);
        setComplementary(null);
        const result = await getComplementaryIngredientsAction({
          ingredients: recipe.ingredients,
          recipeName: recipe.name,
        });
        if (result && !result.error) {
          setComplementary(result);
        }
        setIsLoadingComplementary(false);
      };
      fetchComplementary();
    }
  }, [recipe, isOpen]);

  if (!recipe) return null;

  const isRecipeFavorite = isLoaded && isFavorite(recipe.id);

  const toggleFavorite = () => {
    if (isRecipeFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const adjustServings = (amount: number) => {
    setCurrentServings(prev => Math.max(1, prev + amount));
  };

  const getAdjustedIngredient = (ingredient: string) => {
    const { quantity, unit, name } = parseIngredient(ingredient);
    if (quantity !== null && originalServings > 0) {
      const newQuantity = (quantity / originalServings) * currentServings;
      // round to 2 decimal places if not an integer
      const formattedQuantity = newQuantity % 1 === 0 ? newQuantity : newQuantity.toFixed(2);
      return `${formattedQuantity} ${unit} ${name}`;
    }
    return ingredient;
  };


  const instructionsArray = recipe.instructions
    .split(/\d+\.\s/)
    .filter((step) => step.trim() !== '');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 print:p-0 print:max-w-none print:w-full print:border-0 print:shadow-none">
        <ScrollArea className="h-full print:overflow-visible print:h-auto">
          <div className="printable-content">
            <div className="relative print:hidden">
              <Image
                src={recipe.image}
                alt={recipe.name}
                width={800}
                height={400}
                data-ai-hint={recipe.imageHint}
                className="aspect-[2/1] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-6 print:p-4">
              <SheetHeader className="mb-4 text-left print:text-center">
                <SheetTitle className="font-headline text-3xl md:text-4xl print:text-black print:text-4xl">{recipe.name}</SheetTitle>
                <SheetDescription className="text-base italic pt-1 text-muted-foreground print:text-gray-600">{recipe.shortDescription}</SheetDescription>
                <div className="flex items-center gap-4 pt-2 print:hidden">
                  <Button
                    onClick={toggleFavorite}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Heart
                      className={`h-4 w-4 ${isRecipeFavorite ? 'text-destructive fill-current' : 'text-foreground'}`}
                    />
                    {isRecipeFavorite ? 'Saved' : 'Save'}
                  </Button>
                   <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </SheetHeader>

              <div className="my-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-4 print:grid-cols-4">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 print:bg-gray-100">
                  <Clock className="h-6 w-6 text-primary print:text-black" />
                  <p className="text-sm font-semibold print:text-black">Prep</p>
                  <p className="text-xs text-muted-foreground print:text-gray-600">{recipe.prepTime}</p>
                </div>
                 <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 print:bg-gray-100">
                  <Clock className="h-6 w-6 text-primary print:text-black" />
                  <p className="text-sm font-semibold print:text-black">Cook</p>
                  <p className="text-xs text-muted-foreground print:text-gray-600">{recipe.cookTime}</p>
                </div>
                 <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 print:bg-gray-100">
                  <Utensils className="h-6 w-6 text-primary print:text-black" />
                  <p className="text-sm font-semibold print:text-black">Serves</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 print:hidden" onClick={() => adjustServings(-1)} disabled={currentServings <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground print:text-gray-600">{currentServings}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 print:hidden" onClick={() => adjustServings(1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 print:bg-gray-100">
                  <Award className="h-6 w-6 text-primary print:text-black" />
                  <p className="text-sm font-semibold print:text-black">Difficulty</p>
                  <p className="text-xs text-muted-foreground print:text-gray-600">{recipe.difficulty}</p>
                </div>
              </div>
              
              <div className="mb-6 flex justify-center gap-4 text-center print:grid print:grid-cols-2">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 px-6 print:bg-gray-100">
                    <p className="text-sm font-semibold print:text-black">Cuisine</p>
                    <p className="text-xs text-muted-foreground print:text-gray-600">{recipe.cuisine}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 px-6 print:bg-gray-100">
                    <p className="text-sm font-semibold print:text-black">Calories</p>
                    <p className="text-xs text-muted-foreground print:text-gray-600">{recipe.calories} kcal</p>
                  </div>
              </div>


              <Accordion type="multiple" defaultValue={['ingredients', 'instructions']} className="w-full">
                <AccordionItem value="ingredients">
                  <AccordionTrigger className="text-lg font-semibold print:text-black">Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {recipe.ingredients.map((ing) => (
                        <Badge key={ing} variant="secondary" className="text-base py-1 px-3 print:bg-gray-200 print:text-black">{getAdjustedIngredient(ing)}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="instructions">
                  <AccordionTrigger className="text-lg font-semibold print:text-black">Instructions</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-inside list-decimal space-y-4 pt-2 text-base print:text-black">
                      {instructionsArray.map((step, index) => (
                        <li key={index} className="leading-relaxed">{step.trim()}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="suggestions" className="print:hidden">
                  <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-accent" />
                          Genie's Suggestions
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isLoadingComplementary ? (
                      <div className="flex items-center gap-2 text-muted-foreground pt-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking of complementary ingredients...</span>
                      </div>
                    ) : complementary && complementary.suggestedIngredients ? (
                      <div className="space-y-4 pt-2">
                          <p className="text-base italic text-muted-foreground">{complementary.reasoning}</p>
                          <Separator/>
                          <div className="flex flex-wrap gap-2">
                              {complementary.suggestedIngredients.map((ing) => (
                                  <Badge key={ing} className="bg-accent/80 text-accent-foreground hover:bg-accent">{ing}</Badge>
                              ))}
                          </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground pt-2">Could not get suggestions at this time.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
