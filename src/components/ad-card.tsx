
'use client';
<<<<<<< HEAD
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
=======
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageIcon, LoaderCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { type AdData } from '@/lib/data';
import { doc, updateDoc } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090

type AdCardProps = {
  id: string;
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string; // Original placeholder
  aiHint: string;
<<<<<<< HEAD
  index: number;
=======
  onImageUpdate: (id: string, newImageUrl: string) => void;
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
};

export function AdCard({
  id,
  industry,
  title,
  description,
  cta,
  link,
  image,
  aiHint,
<<<<<<< HEAD
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
=======
  onImageUpdate,
}: AdCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be signed in to generate images.',
      });
      setIsGenerating(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: aiHint }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate image.');
      }
      
      const newImageUrl = result.data.imageUrl;
      
      // Update the image URL in Firestore
      const contentRef = doc(dbClient, 'content', id);
      await updateDoc(contentRef, { image: newImageUrl });
      
      // Update the local state in the parent component
      onImageUpdate(id, newImageUrl);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl h-full">
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5 flex flex-col md:flex-row items-center">
        <div className="p-6 md:w-1/2">
          <CardHeader className="p-0 mb-4">
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{industry}</Badge>
              <Badge variant="outline">Ad</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold font-headline mb-3">{title}</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              {description}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="shiny" size="lg">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGenerateImage}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <ImageIcon />
                )}
                Generate Image
              </Button>
            </div>
          </CardContent>
        </div>
        <div className="relative overflow-hidden h-64 md:h-full md:w-1/2 w-full">
           {isGenerating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <LoaderCircle className="w-10 h-10 animate-spin text-white"/>
            </div>
           )}
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            data-ai-hint={aiHint}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
      </Card>
    </div>
  );
}
