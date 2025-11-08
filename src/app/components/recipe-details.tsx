'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { RecipeWithId } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { getComplementaryIngredientsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

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
import { Heart, Lightbulb, Loader2, Clock, Utensils, Award, Minus, Plus, Share2, BrainCircuit, ListPlus, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HealthSuggestions from './health-suggestions';

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
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { shoppingList, addIngredient, removeIngredient, isInList } = useShoppingList();
  const { toast } = useToast();

  const [complementary, setComplementary] = useState<Complementary | null>(null);
  const [isLoadingComplementary, setIsLoadingComplementary] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  
  const originalServings = recipe ? parseInt(recipe.servings.split(' ')[0]) || 1 : 1;
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

  const isRecipeFavorite = isFavorite(recipe.id);

  const toggleFavorite = () => {
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

  const handleShare = () => {
    const recipeText = `Check out this recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions}`;
    navigator.clipboard.writeText(recipeText);
    toast({
      title: 'Recipe Copied!',
      description: 'The recipe has been copied to your clipboard.',
    });
  };

  const handleToggleShoppingListItem = (ingredient: string) => {
    if(isInList(ingredient)) {
      removeIngredient(ingredient);
    } else {
      addIngredient(ingredient);
    }
  };

  const instructionsArray = recipe.instructions
    .split(/\d+\.\s/)
    .filter((step) => step.trim() !== '');

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0">
          <ScrollArea className="h-full">
            <div className="print:hidden">
              <div className="relative">
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
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
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
                    <Button onClick={() => setIsHealthModalOpen(true)} variant="outline" size="sm" className="bg-accent/10 text-accent-foreground">
                      <BrainCircuit className="h-4 w-4 mr-2 text-accent" />
                      Genie's Tips
                    </Button>
                  </div>
                </SheetHeader>

                <div className="my-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
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
                
                <div className="mb-6 flex justify-center gap-4 text-center">
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
                            <Button size="sm" variant="ghost" onClick={() => handleToggleShoppingListItem(ing)}>
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

                  <AccordionItem value="suggestions">
                    <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-accent" />
                            Complementary Ingredients
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {isLoadingComplementary ? (
                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking of complementary ingredients...</span>
                        </div>
                      ) : complementary && complementary.suggestedIngredients.length > 0 ? (
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
      {isHealthModalOpen && (
        <HealthSuggestions 
          recipe={recipe}
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
        />
      )}
    </>
  );
}
