
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
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5 w-full">
        <CardContent className="p-0 md:p-0">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="w-full md:w-1/2">
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={600}
                  data-ai-hint={aiHint}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                />
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary" className="self-start">{industry}</Badge>
                <Badge variant="outline" className="self-start">Ad</Badge>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-3">{title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
              <Button asChild variant="outline" className="mt-auto self-start">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
