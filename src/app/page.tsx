
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type TrendForecastOutput } from '@/ai/flows/trend-forecasting';
import { Header } from '@/components/header';
import { InputModule } from '@/components/input-module';
import { TrendCard } from '@/components/trend-card';
import { AdCard } from '@/components/ad-card';
import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { sampleTrends, adData, blogData } from '@/lib/data';
import { Bot, Building, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TrendResult = TrendForecastOutput & {
  id: string;
  query: string;
  timeHorizon: string;
};

type ContentItem = 
    | { type: 'ad'; data: typeof adData[0]; id: string }
    | { type: 'blog'; data: typeof blogData[0]; id: string };


export default function Home() {
  const [results, setResults] = useState<TrendResult[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(true);

  const handleNewResult = (result: TrendResult) => {
    setResults((prevResults) => [result, ...prevResults]);
  };
  
  const allCards = useMemo(() => {
    return [
      ...sampleTrends.map(t => ({ type: 'sample' as const, data: t, id: `sample-${t.id}`})),
      ...results.map(r => ({ type: 'trend' as const, data: r, id: `result-${r.id}`})),
    ];
  }, [results]);
  
  const allContentSource = useMemo(() => {
    return [
      ...adData.map((ad, i) => ({ type: 'ad' as const, data: ad, id: `ad-${ad.id}-${i}` })),
      ...blogData.map((blog, i) => ({ type: 'blog' as const, data: blog, id: `blog-${blog.id}-${i}`})),
    ].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    // Initial content load
    setContentItems(allContentSource.slice(0, 4));
    // Shuffle trend cards on client
    setShuffledCards([...allCards].sort(() => Math.random() - 0.5));
  }, [allCards, allContentSource]);


  const loadMoreContent = useCallback(() => {
    if (isLoadingMore || !hasMoreContent) return;

    setIsLoadingMore(true);
    toast({ title: 'Loading more content...', description: 'Exploring the latest strategies & insights.' });

    setTimeout(() => {
        const currentLength = contentItems.length;
        const nextItems = allContentSource.slice(currentLength, currentLength + 4);
        
        if (nextItems.length > 0) {
            setContentItems(prevItems => [...prevItems, ...nextItems]);
        } 
        
        if (contentItems.length + nextItems.length >= allContentSource.length) {
            setHasMoreContent(false);
            toast({ title: "You've reached the end!", description: 'Check back later for more insights.' });
        }
        
        setIsLoadingMore(false);
    }, 1500);
  }, [isLoadingMore, hasMoreContent, allContentSource, contentItems, toast]);

  useEffect(() => {
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight && !isLoadingMore && hasMoreContent) {
            loadMoreContent();
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMoreContent, loadMoreContent]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div id="input-section" className="py-8 scroll-mt-20">
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
        
        <section className="mt-24 text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">Trusted by over 10,000+ creators and brands</h3>
           <div className="mt-8 flex justify-center items-center gap-x-8 md:gap-x-12 lg:gap-x-16 grayscale opacity-60">
                <div className="flex items-center gap-2">
                    <Bot size={24} />
                    <span className="text-xl font-bold">AI Innovators</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Building size={24} />
                    <span className="text-xl font-bold">Agency Co.</span>
                </div>
                 <div className="flex items-center gap-2">
                    <PenTool size={24} />
                    <span className="text-xl font-bold">Creator Hub</span>
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
        
        <section className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-2">
                Strategy & Insights
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Go beyond the data with curated articles and partnership opportunities to grow your brand.
            </p>
             <div className="flex flex-col items-center gap-8">
                {contentItems.map((content, index) => {
                    const Component = content.type === 'ad' ? AdCard : BlogCard;
                    return (
                        <div key={content.id} className="w-full max-w-4xl">
                             <Component {...content.data} index={index} />
                        </div>
                    )
                })}
            </div>
             {isLoadingMore && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading more insights...</p>
                </div>
            )}
        </section>

      </main>
    </div>
  );
}
