
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import type { BlogData } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';

type BlogCardProps = {
  item: BlogData;
};


export function BlogCard({ item }: BlogCardProps) {
  const { title, teaser, tag, image, aiHint, offer, link } = item;
  
  return (
    <Card
      className='glassmorphic rounded-2xl h-full overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 flex flex-col md:flex-row-reverse items-center'
    >
      <div className='overflow-hidden md:w-1/2 w-full h-64 md:h-full'>
        <Image
          src={image || 'https://placehold.co/600x400.png'}
          alt={title}
          width={600}
          height={400}
          data-ai-hint={aiHint}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
