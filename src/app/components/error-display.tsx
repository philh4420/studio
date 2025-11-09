'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="mt-8">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something Went Wrong</AlertTitle>
      <AlertDescription>
        <p className="mb-4">{error}</p>
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
