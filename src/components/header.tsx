
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="container mx-auto px-4 py-16 text-center">
       <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        See Viral Trends Before They Blow Up—<br/>Then <span className="text-gradient">Ride the Wave</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Trendcast AI tracks rising trends in real-time and gives you AI-powered strategies to capitalize on them—no guessing, no sign-up.
      </p>
       <Button size="lg" variant="shiny" asChild>
        <Link href="/#input-section">
          <Sparkles className="mr-2" />
          Get Started (Free Trend Report)
        </Link>
      </Button>
    </header>
  );
}
