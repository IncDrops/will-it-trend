
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageIcon, LoaderCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { AdData } from '@/lib/data';
import { doc, updateDoc } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';


type AdCardProps = {
  item: AdData;
  onImageUpdate: (id: string, newImageUrl: string) => void;
};

export function AdCard({
  item,
  onImageUpdate,
}: AdCardProps) {
  const { id, industry, title, description, cta, link, image, aiHint } = item;
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
                <Link href={link || '#'} target="_blank" rel="noopener noreferrer">
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
      </Card>
    </div>
  );
}
