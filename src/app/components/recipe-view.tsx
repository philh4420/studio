'use client';

import { useState, useMemo } from 'react';
import type { RecipeWithId } from '@/lib/types';
import RecipeList from './recipe-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, AlertTriangle, Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface RecipeViewProps {
  recipes: RecipeWithId[];
  isLoading: boolean;
  error: string | null;
}

type SortOrder = 'name-asc' | 'name-desc';

function RecipeSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export default function RecipeView({
  recipes,
  isLoading,
  error,
}: RecipeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');

  const uniqueCuisines = useMemo(() => {
    const cuisines = new Set(recipes.map(r => r.cuisine));
    return Array.from(cuisines).sort();
  }, [recipes]);

  const uniqueDifficulties = useMemo(() => {
    const difficulties = new Set(recipes.map(r => r.difficulty));
    return Array.from(difficulties).sort();
  }, [recipes]);

  const filteredAndSortedRecipes = useMemo(() => {
    const filtered = recipes.filter(recipe => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCuisine =
        cuisineFilter.length === 0 || cuisineFilter.includes(recipe.cuisine);

      const matchesDifficulty =
        difficultyFilter.length === 0 || difficultyFilter.includes(recipe.difficulty);

      return matchesSearch && matchesCuisine && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      if (sortOrder === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [recipes, searchTerm, cuisineFilter, difficultyFilter, sortOrder]);

  const toggleFilter = (filterList: string[], setFilter: (val: string[]) => void, value: string) => {
    if (filterList.includes(value)) {
      setFilter(filterList.filter(item => item !== value));
    } else {
      setFilter([...filterList, value]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCuisineFilter([]);
    setDifficultyFilter([]);
  };

  const areFiltersActive = searchTerm || cuisineFilter.length > 0 || difficultyFilter.length > 0;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <RecipeSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Recipes Yet</h3>
        <p className="mt-2 text-muted-foreground">
          Add some ingredients and click &quot;Generate Recipes&quot; to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search recipes or ingredients..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Cuisine</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueCuisines.map(cuisine => (
                <DropdownMenuCheckboxItem
                  key={cuisine}
                  checked={cuisineFilter.includes(cuisine)}
                  onCheckedChange={() => toggleFilter(cuisineFilter, setCuisineFilter, cuisine)}
                >
                  {cuisine}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Difficulty</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueDifficulties.map(difficulty => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={difficultyFilter.includes(difficulty)}
                  onCheckedChange={() => toggleFilter(difficultyFilter, setDifficultyFilter, difficulty)}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><ArrowUpDown className="mr-2 h-4 w-4"/>Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {areFiltersActive && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <RecipeList recipes={filteredAndSortedRecipes} />
    </>
  );
}
