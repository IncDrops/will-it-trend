
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { AdData } from '@/lib/data';

type PhoneSizeCardProps = {
  item: AdData;
};

export function PhoneSizeCard({ item }: PhoneSizeCardProps) {
  return (
    <Card className="w-full max-w-sm glassmorphic rounded-3xl overflow-hidden relative aspect-[9/19.5] group border-4 border-card-foreground/20 shadow-2xl">
      <Image
        src={item.image}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        data-ai-hint={item.aiHint}
        className="transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white w-full">
        <Badge variant="secondary" className="mb-2">{item.industry}</Badge>
        <h3 className="text-3xl font-bold font-headline mb-2">
          {item.title}
        </h3>
        <p className="text-white/80 mb-4 text-sm">
          {item.description}
        </p>
        <Button asChild variant="shiny" size="lg" className="w-full">
          <Link href={item.link} target="_blank" rel="noopener noreferrer">
            {item.cta}
            <ArrowUpRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
