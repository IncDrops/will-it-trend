
'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useMemo, useCallback } from 'react';
=======
import React, { useState, useEffect, useMemo, useRef } from 'react';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
import { type TrendForecastOutput } from '@/ai/flows/trend-forecasting';
import { Header } from '@/components/header';
import { InputModule } from '@/components/input-module';
import { TrendCard } from '@/components/trend-card';
import { ScrollAnimate } from '@/components/scroll-animate';
import { sampleTrends, type ContentItem, AdData, BlogData } from '@/lib/data';
import { useContent } from '@/hooks/use-content';
import { Bot, Building, PenTool, Car, TrendingUp, Cpu, Brain, Leaf, Briefcase, Laptop, Smartphone, Tablet, TrendingUpIcon, LoaderCircle } from 'lucide-react';
import { PageSizeCard } from '@/components/page-size-card';
import { InstagramPostCard } from '@/components/instagram-post-card';
import { AdCard as AdCardComponent } from '@/components/ad-card';
import { PhoneSizeCard } from '@/components/phone-size-card';
import { BlogCard } from '@/components/blog-card';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { sampleTrends, adData, blogData } from '@/lib/data';
import { Bot, Building, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
=======
import { IconSeparator } from '@/components/icon-separator';
import { Card } from '@/components/ui/card';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090

type TrendResult = TrendForecastOutput & {
  id: string;
  query: string;
  timeHorizon: string;
};

<<<<<<< HEAD
type ContentItem = 
    | { type: 'ad'; data: typeof adData[0]; id: string }
    | { type: 'blog'; data: typeof blogData[0]; id: string };
=======
// Component mapping for dynamic rendering
const componentMap = {
  '1': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'ad' && <PageSizeCard item={item as AdData} onImageUpdate={onImageUpdate} />,
  '2': (item: ContentItem) => item.type === 'blog' && <InstagramPostCard item={item as BlogData} />,
  '3': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'ad' && <div className="w-full max-w-4xl"><AdCardComponent {...(item as AdData)} onImageUpdate={onImageUpdate} /></div>,
  '4': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'blog' && <PageSizeCard item={item as BlogData} onImageUpdate={onImageUpdate} />,
  '5': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'ad' && <PhoneSizeCard item={item as AdData} onImageUpdate={onImageUpdate} />,
  '6': (item: ContentItem) => item.type === 'blog' && <div className="w-full max-w-4xl"><BlogCard {...(item as BlogData)} /></div>,
  '7': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => (
    <div className="flex w-full items-center justify-center gap-4">
      <Leaf className="w-8 h-8 text-primary/70" />
      {item.type === 'ad' && <div className="w-full max-w-2xl aspect-square"><AdCardComponent {...(item as AdData)} onImageUpdate={onImageUpdate} /></div>}
      <Briefcase className="w-8 h-8 text-primary/70" />
    </div>
  ),
  '8': (item: ContentItem) => item.type === 'blog' && <div className="w-full max-w-4xl"><BlogCard {...(item as BlogData)} /></div>,
  '9': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'ad' && <div className="w-full max-w-2xl aspect-square"><AdCardComponent {...(item as AdData)} onImageUpdate={onImageUpdate} /></div>,
  '10': (item: ContentItem, onImageUpdate: (id: string, newImageUrl: string) => void) => item.type === 'blog' && <PageSizeCard item={item as BlogData} onImageUpdate={onImageUpdate} />,
};

// Icon mapping for separators
const iconMap: { [key: string]: React.ElementType | React.ElementType[] } = {
  '1': Car,
  '2': TrendingUp,
  '3': Cpu,
  '4': Laptop,
  '5': [Smartphone, Tablet, Laptop],
  '6': Brain,
  '7': Leaf,
  '8': Laptop,
  '9': TrendingUpIcon,
};
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090


export default function Home() {
  const [results, setResults] = useState<TrendResult[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
<<<<<<< HEAD
  
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(true);
=======
  const { content, loading: contentLoading, error, handleImageUpdate } = useContent();

>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090

  const handleNewResult = (result: TrendResult) => {
    setResults((prevResults) => [result, ...prevResults]);
  };
  
  const allCards = useMemo(() => {
    return [
      ...sampleTrends.map(t => ({ type: 'sample' as const, data: t, id: `sample-${t.id}`})),
      ...results.map(r => ({ type: 'trend' as const, data: r, id: `result-${r.id}`})),
    ];
  }, [results]);
<<<<<<< HEAD
  
  const allContentSource = useMemo(() => {
    return [
      ...adData.map((ad, i) => ({ type: 'ad' as const, data: ad, id: `ad-${ad.id}-${i}` })),
      ...blogData.map((blog, i) => ({ type: 'blog' as const, data: blog, id: `blog-${blog.id}-${i}`})),
    ].sort(() => Math.random() - 0.5);
  }, []);
=======
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090

  useEffect(() => {
    // Initial content load
    setContentItems(allContentSource.slice(0, 4));
    // Shuffle trend cards on client
    setShuffledCards([...allCards].sort(() => Math.random() - 0.5));
<<<<<<< HEAD
  }, [allCards, allContentSource]);
=======
  }, [allCards]);
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090


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
<<<<<<< HEAD
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
=======
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
                {content.map((item, index) => {
                    const originalId = item.originalId || item.id;
                    const CardComponent = componentMap[originalId as keyof typeof componentMap];
                    const IconComponent = iconMap[originalId as keyof typeof iconMap];
                    
                    return (
                        <React.Fragment key={item.id}>
                            {CardComponent ? (
                                CardComponent(item, handleImageUpdate)
                            ) : (
                                <Card className="p-4">
                                    <p>Unsupported content type for id: {originalId}</p>
                                </Card>
                            )}

                            {IconComponent && index < content.length - 1 && (
                                Array.isArray(IconComponent)
                                    ? <IconSeparator icons={IconComponent} />
                                    : <IconSeparator icon={IconComponent} />
                            )}
                        </React.Fragment>
                    );
                })}
                
                <div className="mt-16 flex flex-col items-center space-y-2">
                    <TrendingUpIcon className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">WillItTrend.com</span>
                </div>
            </div>
          )}
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
        </section>

      </main>
    </div>
  );
}
