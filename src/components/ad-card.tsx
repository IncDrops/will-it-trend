import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

type AdCardProps = {
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  aiHint: string;
  layout?: 'vertical' | 'default';
};

export function AdCard({
  industry,
  title,
  description,
  cta,
  link,
  image,
  aiHint,
  layout = 'default',
}: AdCardProps) {
  const isVertical = layout === 'vertical';
  return (
    <div className="relative group overflow-hidden rounded-2xl h-full">
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5 flex flex-col">
        <div
          className={cn(
            'grid gap-6 items-center flex-grow',
            isVertical ? 'grid-rows-2' : 'md:grid-cols-2'
          )}
        >
          <div className={cn("p-6", isVertical && "row-start-2")}>
            <CardHeader className="p-0 mb-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{industry}</Badge>
                <Badge variant="outline">Ad</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold font-headline mb-3">
                {title}
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                {description}
              </p>
              <Button asChild variant="shiny" size="lg">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </div>
          <div className={cn("overflow-hidden h-full", isVertical && "row-start-1")}>
            <Image
              src={image}
              alt={title}
              width={600}
              height={isVertical ? 800 : 400}
              data-ai-hint={aiHint}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
