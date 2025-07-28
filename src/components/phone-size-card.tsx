
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImageIcon, LoaderCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { AdData } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';


type PhoneSizeCardProps = {
  item: AdData;
  onImageUpdate: (id: string, newImageUrl: string) => void;
};

export function PhoneSizeCard({ item, onImageUpdate }: PhoneSizeCardProps) {
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
                body: JSON.stringify({ prompt: item.aiHint }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to generate image.');
            }
            
            const newImageUrl = result.data.imageUrl;
            
            // Update the image URL in Firestore
            const contentRef = doc(dbClient, 'content', item.id);
            await updateDoc(contentRef, { image: newImageUrl });
            
            // Update the local state in the parent component
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
    <Card className="w-full max-w-sm glassmorphic rounded-3xl overflow-hidden relative aspect-[9/19.5] group border-4 border-card-foreground/20 shadow-2xl">
      {isGenerating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <LoaderCircle className="w-10 h-10 animate-spin text-white"/>
        </div>
      )}
      <Image
        src={item.image}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        data-ai-hint={item.aiHint}
        className="transition-transform duration-500 group-hover:scale-105 z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 p-6 text-white w-full z-10">
        <Badge variant="secondary" className="mb-2">{item.industry}</Badge>
        <h3 className="text-3xl font-bold font-headline mb-2">
          {item.title}
        </h3>
        <p className="text-white/80 mb-4 text-sm">
          {item.description}
        </p>
        <div className="flex flex-col gap-2">
            <Button asChild variant="shiny" size="lg" className="w-full">
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
                {item.cta}
                <ArrowUpRight className="ml-2" />
            </Link>
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full bg-white/20 text-white backdrop-blur-sm"
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
      </div>
    </Card>
  );
}
