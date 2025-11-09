'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { complementaryIngredients } from '@/app/actions';
import ErrorDisplay from '@/app/components/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { SuggestComplementaryIngredientsOutput } from '@/ai/flows/suggest-complementary-ingredients';

interface ComplementaryIngredientsProps {
  ingredients: string[];
  recipeName: string;
}

export function ComplementaryIngredients({ ingredients, recipeName }: ComplementaryIngredientsProps) {
  const [complements, setComplements] = useState<SuggestComplementaryIngredientsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [complementaryError, setComplementaryError] = useState<string | null>(null);

  const fetchComplementary = async () => {
    setLoading(true);
    setComplementaryError(null);
    setComplements(null);
    const result = await complementaryIngredients({ ingredients, recipeName });

    if ('error' in result) {
      setComplementaryError(result.error);
      setComplements(null);
    } else {
      setComplements(result);
      setComplementaryError(null);
    }
    setLoading(false);
  };

  return (
    <div>
      {complementaryError ? (
        <ErrorDisplay error={complementaryError} onRetry={fetchComplementary} />
      ) : loading ? (
        <div className="flex items-center gap-2 text-muted-foreground pt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking of complementary ingredients...</span>
        </div>
      ) : complements ? (
        <div className="pt-2">
          <p className="italic text-sm text-muted-foreground mb-4">{complements.reasoning}</p>
          {complements.suggestedCategories.map(category => (
            <div key={category.category} className="mb-3">
              <h4 className="font-semibold text-md mb-1">{category.category}</h4>
              <ul className="list-disc list-inside text-sm">
                {category.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <Button onClick={fetchComplementary} disabled={loading}>
          Suggest Complementary Ingredients
        </Button>
      )}
    </div>
  );
}
