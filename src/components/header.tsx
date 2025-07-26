import { Gem } from 'lucide-react';

export function Header() {
  return (
    <header className="container mx-auto px-4 py-8 text-center">
      <div className="inline-flex items-center gap-2 mb-4">
        <Gem className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-gray-300 via-gray-500 to-gray-300 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
          Trendcast AI
        </h1>
      </div>
      <p className="text-2xl md:text-3xl font-headline font-medium max-w-3xl mx-auto">
        What’s the next big thing? <span className="text-gradient">Ask our AI.</span>
      </p>
      <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
        Get instant, AI-powered trend forecasts for ideas, hashtags, products,
        memes, and more.
      </p>
    </header>
  );
}
