
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AdData, BlogData } from '@/lib/data';

type PageSizeCardProps = {
  item: AdData | BlogData;
  onImageUpdate?: (id: string, newImageUrl: string) => void;
};

export function PageSizeCard({ item }: PageSizeCardProps) {
  const isAd = item.type === 'ad';
  const imageUrl = item.image || 'https://placehold.co/1200x600';
  const imageHint = item.aiHint || 'placeholder';

  return (
    <Card className="w-full glassmorphic rounded-2xl overflow-hidden relative aspect-[16/9] md:aspect-[2/1] group">
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
        </div>
      </div>
    </Card>
  );
}
