
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { type TrendForecastOutput } from '@/ai/flows/trend-forecasting';
import { Header } from '@/components/header';
import { InputModule } from '@/components/input-module';
import { TrendCard } from '@/components/trend-card';
import { ScrollAnimate } from '@/components/scroll-animate';
import { sampleTrends, contentData, type ContentItem, AdData, BlogData } from '@/lib/data';
import { useContent } from '@/hooks/use-content';
import { Bot, Building, PenTool, Car, TrendingUp, Cpu, Brain, Leaf, Briefcase, Laptop, Smartphone, Tablet, TrendingUpIcon, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageSizeCard } from '@/components/page-size-card';
import { InstagramPostCard } from '@/components/instagram-post-card';
import { AdCard as AdCardComponent } from '@/components/ad-card';
import { PhoneSizeCard } from '@/components/phone-size-card';
import { BlogCard } from '@/components/blog-card';
import { IconSeparator } from '@/components/icon-separator';

type TrendResult = TrendForecastOutput & {
  id: string;
  query: string;
  timeHorizon: string;
};

export default function Home() {
  const [results, setResults] = useState<TrendResult[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const { content, loading: contentLoading, error, handleImageUpdate } = useContent();


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

  const [
    autoAd,
    socialBlog,
    techAd,
    gadgetBlog,
    mobileAd,
    marketingBlog,
    softwareAd,
    sustainBlog,
    financeAd,
    genZBlog,
  ] = content;


  return (
    <div className="flex flex-col min-h-screen">
      <ScrollAnimate><Header /></ScrollAnimate>
      <main className="flex-grow container mx-auto px-4 py-8">
        <ScrollAnimate>
          <div id="input-section" className="py-8 scroll-mt-20">
            <InputModule onNewResult={handleNewResult} />
          </div>
        </ScrollAnimate>

        <ScrollAnimate>
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
        </ScrollAnimate>
        
        <ScrollAnimate>
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
        </ScrollAnimate>


        <ScrollAnimate>
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
        </ScrollAnimate>
        
        <section className="mt-24">
          <ScrollAnimate>
            <h2 className="text-3xl font-bold text-center mb-2">
                Strategy & Insights
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Go beyond the data with curated articles and partnership opportunities to grow your brand.
            </p>
          </ScrollAnimate>

          {contentLoading ? (
            <div className="flex justify-center items-center p-16">
              <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
                <p>Failed to load content. Please try refreshing the page.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
                {autoAd?.type === 'ad' && <PageSizeCard item={autoAd as AdData} />}
                <IconSeparator icon={Car} />

                {socialBlog?.type === 'blog' && <InstagramPostCard item={socialBlog as BlogData} />}
                <IconSeparator icon={TrendingUp} />

                {techAd?.type === 'ad' && (
                  <div className="w-full max-w-4xl">
                    <AdCardComponent {...(techAd as AdData)} onImageUpdate={handleImageUpdate} />
                  </div>
                )}
                <IconSeparator icon={Cpu} />

                {gadgetBlog?.type === 'blog' && <PageSizeCard item={gadgetBlog as BlogData} />}
                <IconSeparator icon={Laptop} />
                
                {mobileAd?.type === 'ad' && <PhoneSizeCard item={mobileAd as AdData} onImageUpdate={handleImageUpdate} />}
                <IconSeparator icons={[Smartphone, Tablet, Laptop]} />

                {marketingBlog?.type === 'blog' && (
                  <div className="w-full max-w-4xl"> <BlogCard {...(marketingBlog as BlogData)}/> </div>
                )}
                <IconSeparator icon={Brain} />
                
                <div className="flex w-full items-center justify-center gap-4">
                    <Leaf className="w-8 h-8 text-primary/70" />
                    {softwareAd?.type === 'ad' && <div className="w-full max-w-2xl aspect-square"><AdCardComponent {...(softwareAd as AdData)} onImageUpdate={handleImageUpdate}/></div>}
                    <Briefcase className="w-8 h-8 text-primary/70" />
                </div>
                <IconSeparator icon={Leaf} />
                
                {sustainBlog?.type === 'blog' && (
                    <div className="w-full max-w-4xl"> <BlogCard {...(sustainBlog as BlogData)}/> </div>
                )}
                <IconSeparator icon={Laptop} />

                {financeAd?.type === 'ad' && (
                    <div className="w-full max-w-2xl aspect-square"><AdCardComponent {...(financeAd as AdData)} onImageUpdate={handleImageUpdate} /></div>
                )}
                <IconSeparator icon={TrendingUpIcon} />


                {genZBlog?.type === 'blog' && <PageSizeCard item={genZBlog as BlogData} />}
                
                <div className="mt-16 flex flex-col items-center space-y-2">
                    <TrendingUpIcon className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">WillItTrend.com</span>
                </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
