
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { BlogData } from '@/lib/data';

const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.45,12.55a1.74,1.74,0,0,1-1.22.86,21.6,21.6,0,0,1-8.46,0,1.74,1.74,0,0,1-1.22-.86,16,16,0,0,1,0-5.1,1.74,1.74,0,0,1,1.22-.86,21.6,21.6,0,0,1,8.46,0,1.74,1.74,0,0,1,1.22.86,16,16,0,0,1,0,5.1Z"/><polygon points="10.8 14.3 13.9 12 10.8 9.7 10.8 14.3"/></svg>
)

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.85-.38-6.73-1.77-1.3-.95-2.22-2.3-2.65-3.8-1.18-4.23.05-8.62 2.9-11.49 1.32-1.31 3.01-2.17 4.8-2.31 1.39-.11 2.77-.14 4.16-.12z"/>
  </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.5,12.2A2.3,2.3,0,0,1,14.2,16.5H9.8A2.3,2.3,0,0,1,7.5,14.2V9.8A2.3,2.3,0,0,1,9.8,7.5h4.4A2.3,2.3,0,0,1,16.5,9.8Z"/><path d="M12,9.3a2.7,2.7,0,1,0,2.7,2.7A2.7,2.7,0,0,0,12,9.3Z"/><circle cx="14.8" cy="9.2" r="0.6"/></svg>
)

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor"><path d="M22,5.8a8.5,8.5,0,0,1-2.4.6,4.3,4.3,0,0,0,1.8-2.3,8.5,8.5,0,0,1-2.6,1,4.2,4.2,0,0,0-7.2,3.9,12,12,0,0,1-8.7-4.4,4.2,4.2,0,0,0,1.3,5.6,4.2,4.2,0,0,1-1.9-.5v0.1a4.2,4.2,0,0,0,3.4,4.1,4.2,4.2,0,0,1-1.9.1,4.2,4.2,0,0,0,3.9,2.9,8.5,8.5,0,0,1-5.2,1.8A9,9,0,0,1,2,17.1a12,12,0,0,0,6.4,1.9c7.7,0,11.9-6.4,11.9-11.9v-.5A8.5,8.5,0,0,0,22,5.8Z"/></svg>
)


type InstagramPostCardProps = {
  item: BlogData;
};

export function InstagramPostCard({ item }: InstagramPostCardProps) {
  return (
    <Card className="glassmorphic rounded-2xl w-full max-w-lg aspect-[4/5] overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 flex flex-col items-center justify-between p-6">
       <div className="flex flex-col items-center text-center">
            <Badge className="self-center mb-4 bg-accent text-accent-foreground hover:bg-accent/80">
                {item.tag}
            </Badge>
            <h3 className="text-2xl font-bold font-headline mb-2">
                {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{item.teaser}</p>
       </div>
       
        <div className="grid grid-cols-2 gap-8 text-foreground/80">
            <InstagramIcon />
            <TikTokIcon />
            <TwitterIcon />
            <YouTubeIcon />
        </div>

      <Link
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto self-center text-sm font-semibold text-primary inline-flex items-center gap-2 group-hover:text-accent transition-colors pt-6"
      >
        {item.offer}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}

