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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';


export default function UserMenu() {
  const user = useUser();
  const app = useFirebaseApp();
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // This component will only be rendered when user is null, so it directly displays the forms.
  return (
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
  );
}
