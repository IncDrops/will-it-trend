import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Will It Trend? - See Viral Trends Before They Blow Up',
  description:
    'Track rising trends in real-time and get AI-powered strategies to capitalize on them—no guessing, no sign-up.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable
        )}
      >
        <Nav />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
