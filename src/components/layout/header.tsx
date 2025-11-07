import { FridgeGenieLogo } from '@/components/icons';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <FridgeGenieLogo className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          Fridge Genie
        </h1>
      </div>
    </header>
  );
}
