
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

type BlogCardProps = {
  title: string;
  teaser: string;
  tag: string;
  image: string;
  aiHint: string;
  offer: string;
  link: string;
};

export function BlogCard({ title, teaser, tag, image, aiHint, offer, link }: BlogCardProps) {
  return (
    <Card className="glassmorphic rounded-2xl h-full overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
      <div className="overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={600}
          data-ai-hint={aiHint}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6 flex flex-col h-full">
        <Badge className="self-start mb-4 bg-accent text-accent-foreground hover:bg-accent/80">{tag}</Badge>
        <h3 className="text-lg font-bold font-headline mb-2 flex-grow">{title}</h3>
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
