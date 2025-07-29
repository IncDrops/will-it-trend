
<<<<<<< HEAD
=======
'use client';

>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
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
<<<<<<< HEAD
    <div className="relative group overflow-hidden rounded-2xl">
      <div className="absolute inset-0 z-0 animate-border-spin rounded-[inherit] bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%]" />
      <Card className="relative z-10 glassmorphic rounded-xl h-full m-0.5 w-full">
        <CardContent className="p-0">
          <div>
            <Image
              src={image}
              alt={title}
              width={1200}
              height={600}
              data-ai-hint={aiHint}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-xl"
            />
            <div className="p-6 flex flex-col">
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary" className="self-start">{industry}</Badge>
                <Badge variant="outline" className="self-start">Ad</Badge>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-3">{title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
              <Button asChild variant="outline" className="mt-auto self-start">
                <Link href={link} target="_blank" rel="noopener noreferrer">
=======
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
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
                  {cta}
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
            </div>
<<<<<<< HEAD
          </div>
        </CardContent>
=======
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
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
      </Card>
    </div>
  );
}
