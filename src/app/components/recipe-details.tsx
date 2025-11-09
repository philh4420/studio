'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { RecipeWithId } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { useToast } from '@/hooks/use-toast';
import { ComplementaryIngredients } from './complementary-ingredients';

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
import { Heart, Lightbulb, Loader2, Clock, Utensils, Award, Minus, Plus, Share2, BrainCircuit, ListPlus, Check, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HealthSuggestions from './health-suggestions';
import { Skeleton } from '@/components/ui/skeleton';

interface RecipeDetailsProps {
  recipe: RecipeWithId | null;
  isOpen: boolean;
  onClose: () => void;
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
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { shoppingList, addIngredient, removeIngredient, isInList } = useShoppingList();
  const { toast } = useToast();

  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  
  const originalServings = recipe ? parseInt(recipe.servings.split(' ')[0]) || 1 : 1;
  const [currentServings, setCurrentServings] = useState(originalServings);

  useEffect(() => {
    if (recipe) {
      setCurrentServings(parseInt(recipe.servings.split(' ')[0]) || 1);
    }
  }, [recipe]);


  const isRecipeFavorite = recipe ? isFavorite(recipe.id) : false;

  const toggleFavorite = () => {
    if (!recipe) return;
    if (isRecipeFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
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

  const handleShare = async () => {
    if (!recipe) return;
    const recipeText = `Check out this recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions}`;
    try {
      await navigator.clipboard.writeText(recipeText);
      toast({
        title: 'Recipe Copied!',
        description: 'The recipe has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Clipboard access is blocked in this environment. Please copy the recipe manually.',
      });
      console.error('Failed to copy text: ', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleShoppingListItem = (ingredient: string) => {
    if (!recipe) return;
    if(isInList(ingredient)) {
      removeIngredient(ingredient);
    } else {
      addIngredient(ingredient);
    }
  };

  const instructionsArray = recipe?.instructions
    .split(/\d+\.\s/)
    .filter((step) => step.trim() !== '') || [];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 print:p-0 print:max-w-full print:border-0">
          <ScrollArea className="h-full print:h-auto">
            <div className="p-6 print:p-4">
              {!recipe ? (
                <div className="space-y-6">
                  <Skeleton className="aspect-[2/1] w-full h-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <>
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

                  <div className="p-6">
                    <SheetHeader className="mb-4 text-left">
                      <SheetTitle className="font-headline text-3xl md:text-4xl">{recipe.name}</SheetTitle>
                      <SheetDescription className="text-base italic pt-1 text-muted-foreground">{recipe.shortDescription}</SheetDescription>
                      <div className="flex items-center gap-2 pt-2 flex-wrap print:hidden">
                        <Button
                          onClick={toggleFavorite}
                          variant="outline"
                          size="sm"
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 ${isRecipeFavorite ? 'text-destructive fill-current' : 'text-foreground'}`}
                          />
                          {isRecipeFavorite ? 'Saved' : 'Save'}
                        </Button>
                        <Button onClick={handleShare} variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button onClick={handlePrint} variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button onClick={() => setIsHealthModalOpen(true)} variant="outline" size="sm" className="bg-accent/10 text-accent-foreground">
                          <BrainCircuit className="h-4 w-4 mr-2 text-accent" />
                          Genie&apos;s Tips
                        </Button>
                      </div>
                    </SheetHeader>

                    <div className="my-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-4 print:hidden">
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3">
                        <Clock className="h-6 w-6 text-primary" />
                        <p className="text-sm font-semibold">Prep</p>
                        <p className="text-xs text-muted-foreground">{recipe.prepTime}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3">
                        <Clock className="h-6 w-6 text-primary" />
                        <p className="text-sm font-semibold">Cook</p>
                        <p className="text-xs text-muted-foreground">{recipe.cookTime}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3">
                        <Utensils className="h-6 w-6 text-primary" />
                        <p className="text-sm font-semibold">Serves</p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => adjustServings(-1)} disabled={currentServings <= 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-bold">{currentServings}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => adjustServings(1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3">
                        <Award className="h-6 w-6 text-primary" />
                        <p className="text-sm font-semibold">Difficulty</p>
                        <p className="text-xs text-muted-foreground">{recipe.difficulty}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6 flex justify-center gap-4 text-center print:hidden">
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 px-6">
                          <p className="text-sm font-semibold">Cuisine</p>
                          <p className="text-xs text-muted-foreground">{recipe.cuisine}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 px-6">
                          <p className="text-sm font-semibold">Calories</p>
                          <p className="text-xs text-muted-foreground">{recipe.calories} kcal</p>
                        </div>
                    </div>


                    <Accordion type="multiple" defaultValue={['ingredients', 'instructions']} className="w-full">
                      <AccordionItem value="ingredients">
                        <AccordionTrigger className="text-lg font-semibold">Ingredients</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pt-2">
                            {recipe.ingredients.map((ing) => (
                               <li key={ing} className="flex items-center justify-between group">
                                <span className="text-base">{getAdjustedIngredient(ing)}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleToggleShoppingListItem(ing)} className="print:hidden">
                                   {isInList(ing) ? 
                                     <Check className="h-4 w-4 mr-2 text-primary"/> : 
                                     <ListPlus className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary"/>
                                   }
                                   {isInList(ing) ? 'Added' : 'Add'}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="instructions">
                        <AccordionTrigger className="text-lg font-semibold">Instructions</AccordionTrigger>
                        <AccordionContent>
                          <ol className="list-inside list-decimal space-y-4 pt-2 text-base">
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
                                Complementary Ingredients
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ComplementaryIngredients ingredients={recipe.ingredients} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      {isHealthModalOpen && recipe && (
        <HealthSuggestions 
          recipe={recipe}
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
        />
      )}
    </>
  );
}
