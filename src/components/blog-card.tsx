
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import type { BlogData } from '@/lib/data';

type BlogCardProps = {
  item: BlogData;
};


export function BlogCard({ item }: BlogCardProps) {
  if (!item) {
    return null;
  }
  const { title, teaser, tag, image, aiHint, offer, link } = item;
  
  return (
    <Card
      className='glassmorphic rounded-xl h-full overflow-hidden flex flex-col'
    >
      <div className='overflow-hidden w-full h-64 rounded-t-xl'>
        <Image
          src={image || 'https://placehold.co/1200x600.png'}
          alt={title}
          width={1200}
          height={600}
          data-ai-hint={aiHint}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <Badge className="self-start mb-4 bg-accent text-accent-foreground hover:bg-accent/80">
          {tag}
        </Badge>
        <h3 className="text-xl font-bold mb-2 flex-grow">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{teaser}</p>
        <Link
          href={link || '#'}
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
