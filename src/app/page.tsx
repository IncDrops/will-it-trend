'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { type TrendForecastOutput } from '@/ai/flows/trend-forecasting';
import { Header } from '@/components/header';
import { InputModule } from '@/components/input-module';
import { TrendCard } from '@/components/trend-card';
import { AdCard } from '@/components/ad-card';
import { BlogCard } from '@/components/blog-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { adData, blogData, sampleTrends } from '@/lib/data';

type TrendResult = TrendForecastOutput & {
  id: string;
  query: string;
  timeHorizon: string;
};

export default function Home() {
  const [results, setResults] = useState<TrendResult[]>([]);
  const [shuffledAds, setShuffledAds] = useState(adData);

  useEffect(() => {
    // Shuffle ads on client-side mount to avoid hydration mismatch
    setShuffledAds([...adData].sort(() => Math.random() - 0.5));
  }, []);

  const handleNewResult = (result: TrendResult) => {
    setResults((prevResults) => [result, ...prevResults]);
  };
  
  const allCards = useMemo(() => {
    const cards: { type: 'trend' | 'sample' | 'ad'; data: any; id: string; }[] = [
      ...sampleTrends.map(t => ({ type: 'sample' as const, data: t, id: `sample-${t.id}`})),
      ...results.map(r => ({ type: 'trend' as const, data: r, id: `result-${r.id}`})),
      ...shuffledAds.map(a => ({ type: 'ad' as const, data: a, id: `ad-${a.id}`}))
    ].sort(() => Math.random() - 0.5); // Randomize card order for dynamic layout
    
    return cards;
  }, [results, shuffledAds]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <InputModule onNewResult={handleNewResult} />

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-2 font-headline">
            How It Works
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Here are some examples of AI-powered trend forecasts. See a query,
            its projected score, and the rationale behind it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-auto">
            {sampleTrends.map((trend, index) => {
              const spans = [
                'md:col-span-2',
                'md:col-span-1',
                'md:col-span-1',
                'md:col-span-2',
                'md:col-span-1',
              ];
              return (
                <div key={trend.id} className={`${spans[index % spans.length]}`}>
                  <TrendCard
                    query={trend.query}
                    timer={trend.timer}
                    score={trend.score}
                    rationale={trend.rationale}
                    isSample
                  />
                </div>
              );
            })}
          </div>
        </div>

        {(results.length > 0) && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">
              Recent Forecasts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((result) => (
                <div key={result.id} className="md:col-span-1 lg:col-span-2">
                  <TrendCard
                    query={result.query}
                    timer={result.timeHorizon}
                    score={result.trendScore}
                    rationale={result.rationale}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {shuffledAds.map((ad) => <AdCard key={ad.id} {...ad} />)}
        </div>
        
        <div className="mt-16">
           <h2 className="text-3xl font-bold text-center mb-8 font-headline">
            AI & Trend Insights
          </h2>
           <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {blogData.map((post) => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <BlogCard {...post} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

      </main>
    </div>
  );
}
