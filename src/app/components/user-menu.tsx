'use client';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useUser, useFirebaseApp } from '@/firebase';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FridgeGenieLogo } from '@/components/icons';

export default function UserMenu() {
  const user = useUser();
  const app = useFirebaseApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    if (!app) {
      console.error('Firebase app not initialized');
      setIsLoading(false);
      return;
    }
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setIsLoginDialogOpen(false);
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!app) {
      console.error('Firebase app not initialized');
      return;
    }
    const auth = getAuth(app);
    await signOut(auth);
  };

  if (user === undefined) {
     return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!user) {
    return (
      <>
        <Button variant="outline" onClick={() => setIsLoginDialogOpen(true)}>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
                <FridgeGenieLogo className="h-8 w-8 text-primary" />
                Welcome to Fridge Genie
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Sign in to save your favorite recipes and shopping lists across devices.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.3 111.8 11.8 244 11.8c70.3 0 129.8 27.8 173.4 71.9l-67.4 62c-23-21.6-55.2-34.8-93.2-34.8-69.5 0-126 56.5-126 126s56.5 126 126 126c82.3 0 111.4-62.2 115.3-93.2H244v-75.5h244z"
                    ></path>
                  </svg>
                )}
                Sign in with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.photoURL || undefined}
              alt={user.displayName || 'User'}
            />
            <AvatarFallback>
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
