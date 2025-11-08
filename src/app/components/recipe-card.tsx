'use client';

import Image from 'next/image';
import type { RecipeWithId } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: RecipeWithId;
  onSelectRecipe: (recipe: RecipeWithId) => void;
}

export default function RecipeCard({
  recipe,
  onSelectRecipe,
}: RecipeCardProps) {
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
  const isRecipeFavorite = isLoaded && isFavorite(recipe.id);
  const { toast } = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRecipeFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const recipeText = `Check out this recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions}`;
    navigator.clipboard.writeText(recipeText);
    toast({
      title: 'Recipe Copied!',
      description: 'The recipe has been copied to your clipboard.',
    });
  };

  return (
    <Card
      className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg"
      onClick={() => onSelectRecipe(recipe)}
    >
      <div className="relative">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={600}
          height={400}
          data-ai-hint={recipe.imageHint}
          className="aspect-[3/2] w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-background/50 text-destructive hover:bg-background/80 hover:text-destructive"
            onClick={toggleFavorite}
            aria-label={isRecipeFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-5 w-5 ${isRecipeFavorite ? 'fill-current' : ''}`}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-background/50 text-foreground hover:bg-background/80"
            onClick={handleShare}
            aria-label="Share recipe"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="font-headline text-2xl">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.slice(0, 5).map((ing) => (
            <Badge key={ing} variant="outline">
              {ing}
            </Badge>
          ))}
          {recipe.ingredients.length > 5 && (
            <Badge variant="outline">...</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
