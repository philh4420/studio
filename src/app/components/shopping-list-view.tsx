'use client';

import { useShoppingList } from '@/hooks/use-shopping-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ShoppingBasket, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/firebase';

export default function ShoppingListView() {
  const user = useUser();
  const { shoppingList, removeIngredient, clearList } = useShoppingList();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleToggleChecked = (ingredient: string) => {
    if (checkedItems.includes(ingredient)) {
      setCheckedItems(checkedItems.filter(item => item !== ingredient));
    } else {
      setCheckedItems([...checkedItems, ingredient]);
    }
  };
  
  const handleRemoveChecked = () => {
    checkedItems.forEach(item => removeIngredient(item));
    setCheckedItems([]);
  };

  if (!user) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Please Log In</h3>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in to see your shopping list.
        </p>
      </div>
    );
  }

  if (shoppingList.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBasket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Your Shopping List is Empty</h3>
        <p className="mt-2 text-muted-foreground">
          Add ingredients from recipes to build your list.
        </p>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="h-6 w-6 text-primary" />
            Shopping List
          </div>
          <div className="flex gap-2">
            {checkedItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleRemoveChecked}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Checked
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={clearList}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          <ul className="space-y-3">
            {shoppingList.map(ingredient => (
              <li key={ingredient} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${checkedItems.includes(ingredient) ? 'bg-secondary/40' : 'bg-secondary/20'}`}>
                <div className="flex items-center gap-4">
                   <Checkbox 
                    id={ingredient} 
                    checked={checkedItems.includes(ingredient)}
                    onCheckedChange={() => handleToggleChecked(ingredient)}
                  />
                  <label htmlFor={ingredient} className={`text-base ${checkedItems.includes(ingredient) ? 'line-through text-muted-foreground' : ''}`}>
                    {ingredient}
                  </label>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeIngredient(ingredient)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
