import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

type BlogCardProps = {
  title: string;
  teaser: string;
  tag: string;
  image: string;
  aiHint: string;
  offer: string;
  link: string;
  layout?: 'vertical' | 'default';
};

export function BlogCard({
  title,
  teaser,
  tag,
  image,
  aiHint,
  offer,
  link,
  layout = 'default',
}: BlogCardProps) {
  const isVertical = layout === 'vertical';
  return (
    <Card
      className={cn(
        'glassmorphic rounded-2xl h-full overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 flex flex-col',
        isVertical ? 'md:flex-col' : 'md:flex-row'
      )}
    >
      <div className={cn("overflow-hidden", isVertical ? 'h-96' : 'md:w-1/2')}>
        <Image
          src={image}
          alt={title}
          width={600}
          height={isVertical ? 800 : 400}
          data-ai-hint={aiHint}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6 flex flex-col h-full flex-1">
        <Badge className="self-start mb-4 bg-accent text-accent-foreground hover:bg-accent/80">
          {tag}
        </Badge>
        <h3 className="text-lg font-bold font-headline mb-2 flex-grow">
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
