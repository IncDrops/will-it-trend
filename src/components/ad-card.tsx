import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

type AdCardProps = {
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  aiHint: string;
};

export function AdCard({
  industry,
  title,
  description,
  cta,
  link,
  image,
  aiHint,
}: AdCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl">
      <div className="absolute inset-0 z-0 animate-border-spin rounded-[inherit] bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%]" />
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5">
        <CardContent className="p-6 flex flex-col h-full">
          <Badge variant="secondary" className="self-start mb-4">{industry}</Badge>
          <div className="mb-4 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              data-ai-hint={aiHint}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
          <Button asChild variant="outline" className="mt-auto self-start">
            <Link href={link} target="_blank" rel="noopener noreferrer">
              {cta}
              <ArrowUpRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
