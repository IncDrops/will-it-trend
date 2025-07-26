import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Trendcast AI - Predict the Next Big Thing',
  description:
    'Get instant, AI-powered trend forecasts for ideas, hashtags, products, memes, and more.',
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
          spaceGrotesk.variable
        )}
      >
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
