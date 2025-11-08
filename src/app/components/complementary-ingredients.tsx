'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { complementaryIngredients } from '@/app/actions';

export function ComplementaryIngredients({ ingredients }: { ingredients: string[] }) {
  const [complements, setComplements] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await complementaryIngredients({ ingredients });
    if (result) {
      setComplements(result.complements);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Suggest Complementary Ingredients'}
      </Button>
      {complements && (
        <ul>
          {complements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
