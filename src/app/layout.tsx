import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/nav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Trendcast AI - Predict Viral Trends',
  description:
    'Use AI to forecast the trending potential of any idea, hashtag, or product. Incorporates market trends, social buzz, and competitive analysis.',
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
        <div className="animated-grid-background fixed inset-0 z-[-1] h-screen w-full" />
        <div className="relative z-10">
            <Nav />
            {children}
            <Toaster />
            <Footer />
        </div>
      </body>
    </html>
  );
}
