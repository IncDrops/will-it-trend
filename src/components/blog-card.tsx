
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
<<<<<<< HEAD
import { getImageForPrompt } from '@/lib/actions';
import { Skeleton } from './ui/skeleton';
=======
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
import { cn } from '@/lib/utils';

type BlogCardProps = {
  title: string;
  teaser: string;
  tag: string;
  image: string; // Original placeholder
  aiHint: string;
  offer: string;
  link: string;
  index: number;
};

<<<<<<< HEAD
export function BlogCard({ title, teaser, tag, image, aiHint, offer, link, index }: BlogCardProps) {
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
    <Card 
        ref={cardRef}
        className={cn("glassmorphic rounded-2xl h-full overflow-hidden group transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-accent/10", isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}
        style={{transitionDelay: `${index * 100}ms`}}
    >
      <div className="overflow-hidden h-48 flex items-center justify-center bg-muted/30">
        {isLoading || !imageUrl ? (
            <Skeleton className="w-full h-full" />
        ) : (
            <Image
                src={imageUrl}
                alt={title}
                width={600}
                height={400}
                data-ai-hint={aiHint}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        )}
=======
export function BlogCard({
  title,
  teaser,
  tag,
  image,
  aiHint,
  offer,
  link,
}: BlogCardProps) {
  return (
    <Card
      className='glassmorphic rounded-2xl h-full overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 flex flex-col md:flex-row-reverse items-center'
    >
      <div className='overflow-hidden md:w-1/2 w-full h-64 md:h-full'>
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          data-ai-hint={aiHint}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
      </div>
      <CardContent className="p-6 flex flex-col h-full flex-1 md:w-1/2">
        <Badge className="self-start mb-4 bg-accent text-accent-foreground hover:bg-accent/80">
          {tag}
        </Badge>
        <h3 className="text-xl font-bold font-headline mb-2 flex-grow">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{teaser}</p>
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start text-sm font-semibold text-primary inline-flex items-center gap-2 group-hover:text-accent transition-colors"
        >
          {offer}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
