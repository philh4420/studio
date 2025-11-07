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
import { Heart, ChefHat, Lightbulb, Loader2 } from 'lucide-react';
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

export default function RecipeDetails({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailsProps) {
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
  const [complementary, setComplementary] = useState<Complementary | null>(null);
  const [isLoadingComplementary, setIsLoadingComplementary] = useState(false);

  useEffect(() => {
    if (recipe && isOpen) {
      const fetchComplementary = async () => {
        setIsLoadingComplementary(true);
        setComplementary(null);
        const result = await getComplementaryIngredientsAction({
          ingredients: recipe.ingredients,
          recipeName: recipe.name,
        });
        if (!result.error) {
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

  const instructionsArray = recipe.instructions
    .split(/\d+\.\s/)
    .filter((step) => step.trim() !== '');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0">
        <ScrollArea className="h-full">
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
            <SheetHeader className="mb-4">
              <SheetTitle className="font-headline text-3xl md:text-4xl">{recipe.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-4 pt-2">
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
              </SheetDescription>
            </SheetHeader>

            <Accordion type="multiple" defaultValue={['ingredients', 'instructions']} className="w-full">
              <AccordionItem value="ingredients">
                <AccordionTrigger className="text-lg font-semibold">Ingredients</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {recipe.ingredients.map((ing) => (
                      <Badge key={ing} variant="secondary" className="text-base py-1 px-3">{ing}</Badge>
                    ))}
                  </div>
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
                        Genie's Suggestions
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isLoadingComplementary ? (
                     <div className="flex items-center gap-2 text-muted-foreground pt-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking of complementary ingredients...</span>
                     </div>
                  ) : complementary && !complementary.error ? (
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
