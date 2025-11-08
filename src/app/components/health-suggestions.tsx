'use client';

import { useState, useEffect } from 'react';
import type { RecipeWithId } from '@/lib/types';
import { makeRecipeHealthierAction } from '@/app/actions';
import type { MakeRecipeHealthierOutput } from '@/ai/flows/make-recipe-healthier';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface HealthSuggestionsProps {
  recipe: RecipeWithId;
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthSuggestions({ recipe, isOpen, onClose }: HealthSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<MakeRecipeHealthierOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setSuggestions(null);
        const result = await makeRecipeHealthierAction({ recipe });
        if (result) {
          setSuggestions(result);
        }
        setIsLoading(false);
      };
      fetchSuggestions();
    }
  }, [isOpen, recipe]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Genie&apos;s Health Tips for {recipe.name}
          </DialogTitle>
          <DialogDescription>
            Here are some AI-powered suggestions to make this recipe even healthier.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">The Genie is thinking...</p>
            </div>
          )}
          {suggestions && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Ingredient Swaps</h3>
                <div className="space-y-4">
                  {suggestions.suggestions.map((s, i) => (
                    <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                      <p>
                        Instead of{' '}
                        <Badge variant="secondary">{s.originalIngredient}</Badge>, try{' '}
                        <Badge className="bg-accent/80 text-accent-foreground">{s.healthierAlternative}</Badge>.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{s.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">General Tips</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{suggestions.generalTips}</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
