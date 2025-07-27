'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { type TrendForecastOutput } from '@/ai/flows/trend-forecasting';
import { Header } from '@/components/header';
import { InputModule } from '@/components/input-module';
import { TrendCard } from '@/components/trend-card';
import { Button } from '@/components/ui/button';
import { sampleTrends } from '@/lib/data';

type TrendResult = TrendForecastOutput & {
  id: string;
  query: string;
  timeHorizon: string;
};

export default function Home() {
  const [results, setResults] = useState<TrendResult[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);

  const handleNewResult = (result: TrendResult) => {
    setResults((prevResults) => [result, ...prevResults]);
  };
  
  const allCards = useMemo(() => {
    return [
      ...sampleTrends.map(t => ({ type: 'sample' as const, data: t, id: `sample-${t.id}`})),
      ...results.map(r => ({ type: 'trend' as const, data: r, id: `result-${r.id}`})),
    ];
  }, [results]);

  useEffect(() => {
    // Shuffle cards only on the client-side to avoid hydration mismatch
    setShuffledCards([...allCards].sort(() => Math.random() - 0.5));
  }, [allCards]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="py-8">
          <InputModule onNewResult={handleNewResult} />
        </div>

        <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">A simple 3-step process to stay ahead of the curve.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glassmorphic p-6 rounded-xl">
                    <div className="text-5xl mb-4">1.</div>
                    <h3 className="text-xl font-semibold mb-2">Track</h3>
                    <p className="text-muted-foreground">We monitor millions of data points across social media to spot emerging patterns.</p>
                </div>
                <div className="glassmorphic p-6 rounded-xl">
                    <div className="text-5xl mb-4">2.</div>
                    <h3 className="text-xl font-semibold mb-2">Predict</h3>
                    <p className="text-muted-foreground">Our AI analyzes the growth, engagement, and context to forecast a trend's potential.</p>
                </div>
                 <div className="glassmorphic p-6 rounded-xl">
                    <div className="text-5xl mb-4">3.</div>
                    <h3 className="text-xl font-semibold mb-2">Create</h3>
                    <p className="text-muted-foreground">Get AI-generated content ideas, captions, and hashtags to ride the wave.</p>
                </div>
            </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-2">
            Live Trend Preview
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Here are some examples of AI-powered trend forecasts. See a query,
            its projected score, and the rationale behind it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {shuffledCards.map((card) => (
                <TrendCard
                  key={card.id}
                  query={card.data.query}
                  timer={card.type === 'sample' ? card.data.timer : card.data.timeHorizon}
                  score={card.type === 'sample' ? card.data.score : card.data.trendScore}
                  rationale={card.data.rationale}
                  isSample={card.type === 'sample'}
                  platform={card.data.platform}
                />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
