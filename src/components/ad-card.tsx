
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
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5 flex flex-col">
        <div className="relative overflow-hidden h-64 w-full">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={600}
            data-ai-hint={aiHint}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <CardHeader className="p-0 mb-4">
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{industry}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <h3 className="text-2xl font-bold font-headline mb-3">{title}</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              {description}
            </p>
          </CardContent>
           <div className="flex gap-2 flex-wrap mt-auto">
              <Button asChild variant="shiny" size="lg">
                <Link href={link || '#'} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
            </div>
        </div>
      </Card>
    </div>
  );
}
