
'use client';

import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/nav';
import { AuthProvider } from '@/hooks/use-auth';
import React from 'react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

// Metadata can't be exported from a client component, so we export it from the RootLayoutProps
// and apply it in the server component that renders this layout.
// export const metadata: Metadata = {
//   title: 'Trendcast AI - Predict Viral Trends',
//   description:
//     'Use AI to forecast the trending potential of any idea, hashtag, or product. Incorporates market trends, social buzz, and competitive analysis.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
       <head>
        <title>Trendcast AI - Predict Viral Trends</title>
        <meta name="description" content="Use AI to forecast the trending potential of any idea, hashtag, or product. Incorporates market trends, social buzz, and competitive analysis." />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          spaceGrotesk.variable
        )}
      >
        <AuthProvider>
          <div className="fixed inset-0 z-[-1] h-full w-full static-grid-background" />
          <div className="fixed inset-0 z-[-1] h-full w-full overflow-hidden">
              <div className="trail" style={{ left: '10%', animationDuration: '8s', animationDelay: '0s' }}></div>
              <div className="trail" style={{ left: '25%', animationDuration: '6s', animationDelay: '-2s' }}></div>
              <div className="trail" style={{ left: '50%', animationDuration: '7s', animationDelay: '-4s' }}></div>
              <div className="trail" style={{ left: '75%', animationDuration: '9s', animationDelay: '-1s' }}></div>
              <div className="trail" style={{ left: '90%', animationDuration: '6s', animationDelay: '-3s' }}></div>
          </div>
          <div className="relative z-10">
              <Nav />
              {children}
              <Toaster />
              <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
