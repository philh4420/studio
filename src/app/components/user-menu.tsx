'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useUser, useFirebaseApp } from '@/firebase';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, Loader2, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from '@/components/ui/tabs';
import { FridgeGenieLogo } from '@/components/icons';


export default function UserMenu() {
  const user = useUser();
  const app = useFirebaseApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    if (!app) {
      console.error('Firebase app not initialized');
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
      return;
    }
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoginDialogOpen(false);
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    if (!app) {
      console.error('Firebase app not initialized');
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
      return;
    }
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginDialogOpen(false);
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
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

  const openLoginDialog = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setIsLoginDialogOpen(true);
  }

  if (user === undefined) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!user) {
    return (
      <>
        <Button variant="outline" onClick={openLoginDialog}>
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
                    Sign in or create an account to save your preferences.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <div className="py-4 space-y-4">
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <Button
                    onClick={handleSignIn}
                    disabled={isLoading || !email || !password}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                    Sign In
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <div className="py-4 space-y-4">
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Password (6+ characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <Button
                    onClick={handleSignUp}
                    disabled={isLoading || !email || !password}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                    Create Account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
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
              {user.displayName || 'User'}
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
