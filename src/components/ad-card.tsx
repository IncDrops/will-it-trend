
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
    <Card className="glassmorphic rounded-xl h-full flex flex-col">
      <div className="relative overflow-hidden h-64 w-full rounded-t-xl">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={600}
          data-ai-hint={aiHint}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <CardHeader className="p-0 mb-4">
          <Badge variant="secondary">{industry}</Badge>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground mb-6 flex-grow">
            {description}
          </p>
        </CardContent>
          <div className="mt-auto">
            <Button asChild variant="shiny">
              <Link href={link || '#'} target="_blank" rel="noopener noreferrer">
                {cta}
                <ArrowUpRight className="ml-2" />
              </Link>
            </Button>
          </div>
      </div>
    </Card>
  );
}
