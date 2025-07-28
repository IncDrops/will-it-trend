
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageIcon, LoaderCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { AdData, BlogData } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';

type PageSizeCardProps = {
  item: AdData | BlogData;
  onImageUpdate?: (id: string, newImageUrl: string) => void;
};

export function PageSizeCard({ item, onImageUpdate }: PageSizeCardProps) {
  const isAd = item.type === 'ad';
  const imageUrl = item.image || 'https://placehold.co/1200x600';
  const imageHint = item.aiHint || 'placeholder';

  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!isAd || !onImageUpdate) return;

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
            body: JSON.stringify({ prompt: imageHint }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to generate image.');
        }
        
        const newImageUrl = result.data.imageUrl;
        const contentRef = doc(dbClient, 'content', item.id);
        await updateDoc(contentRef, { image: newImageUrl });
        
        onImageUpdate(item.id, newImageUrl);

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
    <Card className="w-full glassmorphic rounded-2xl overflow-hidden relative aspect-[16/9] md:aspect-[2/1] group">
      {isGenerating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <LoaderCircle className="w-10 h-10 animate-spin text-white"/>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        data-ai-hint={imageHint}
        className="transition-transform duration-500 group-hover:scale-105 z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full md:w-2/3 z-10">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{isAd ? item.industry : item.tag}</Badge>
          {isAd && <Badge variant="outline">Ad</Badge>}
        </div>
        <h3 className="text-2xl md:text-4xl font-bold font-headline mb-3">
          {item.title}
        </h3>
        <p className="text-white/80 mb-6 hidden md:block">
          {isAd ? (item as AdData).description : item.teaser}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="shiny" size="lg">
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
              {isAd ? (item as AdData).cta : item.offer}
              <ArrowUpRight className="ml-2" />
            </Link>
          </Button>
          {isAd && onImageUpdate && (
             <Button
                variant="outline"
                size="lg"
                className="bg-white/20 text-white backdrop-blur-sm"
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
          )}
        </div>
      </div>
    </Card>
  );
}
