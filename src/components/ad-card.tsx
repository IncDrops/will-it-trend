
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getImageForPrompt } from '@/lib/actions';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

type AdCardProps = {
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string; // Original placeholder
  aiHint: string;
  index: number;
};

export function AdCard({
  industry,
  title,
  description,
  cta,
  link,
  image,
  aiHint,
  index,
}: AdCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let isCancelled = false;
    const fetchImage = async () => {
      setIsLoading(true);
      const result = await getImageForPrompt({ prompt: aiHint });
      if (!isCancelled && result.success && result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
      } else {
        setImageUrl(image);
      }
      setIsLoading(false);
    };

    fetchImage();

    return () => {
      isCancelled = true;
    };
  }, [aiHint, image, isVisible]);

  return (
    <div 
        ref={cardRef}
        className={cn("relative group overflow-hidden rounded-2xl transition-all duration-700 ease-out", isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}
        style={{transitionDelay: `${index * 100}ms`}}
    >
      <div className="absolute inset-0 z-0 animate-border-spin rounded-[inherit] bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%]" />
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="self-start">{industry}</Badge>
            <Badge variant="outline">Ad</Badge>
          </div>
          <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-muted/30 flex items-center justify-center">
            {isLoading || !imageUrl ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Image
                src={imageUrl}
                alt={title}
                width={600}
                height={400}
                data-ai-hint={aiHint}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
          <Button asChild variant="outline" className="mt-auto self-start">
            <Link href={link} target="_blank" rel="noopener noreferrer">
              {cta}
              <ArrowUpRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
