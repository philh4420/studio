'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { complementaryIngredients } from '@/app/actions';
import ErrorDisplay from '@/app/components/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ComplementaryIngredientsProps {
  ingredients: string[];
}

export function ComplementaryIngredients({ ingredients }: ComplementaryIngredientsProps) {
  const [complements, setComplements] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [complementaryError, setComplementaryError] = useState<string | null>(null);

  const fetchComplementary = async () => {
    setLoading(true);
    setComplementaryError(null);
    setComplements(null);
    const result = await complementaryIngredients({ ingredients });

    if ('error' in result) {
      setComplementaryError(result.error);
      setComplements(null);
    } else if (result.suggestedIngredients) {
      setComplements(result.suggestedIngredients);
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
      ) : complements && complements.length > 0 ? (
        <ul>
          {complements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <Button onClick={fetchComplementary} disabled={loading}>
          Suggest Complementary Ingredients
        </Button>
      )}
    </div>
  );
}
