import { FridgeGenieLogo } from '@/components/icons';
import { ThemeToggle } from '@/app/components/theme-toggle';
import UserMenu from '@/app/components/user-menu';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <FridgeGenieLogo className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          Fridge Genie
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
