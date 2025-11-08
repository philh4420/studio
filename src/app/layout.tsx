import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/app/components/theme-provider';
import './globals.css';
import { FirebaseProvider } from '@/firebase/provider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Fridge Genie',
  description: 'Generate meal ideas based on ingredients from your fridge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.className} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FirebaseProvider>{children}</FirebaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
