
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import type { AdData } from '@/lib/data';

type AdCardProps = {
  item: AdData;
};

export function AdCard({
  item,
}: AdCardProps) {
  const { industry, title, description, cta, link, image, aiHint } = item;

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
            </div>
          </CardContent>
        </div>
        <div className="relative overflow-hidden h-64 md:h-full md:w-1/2 w-full">
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
