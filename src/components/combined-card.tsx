import { AdCard } from './ad-card';
import { BlogCard } from './blog-card';

// Define more specific types for your data items
type AdData = {
  type: 'ad';
  id: number;
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  aiHint: string;
  layout?: 'vertical' | 'default';
};

type BlogData = {
  type: 'blog';
  id: number;
  title: string;
  teaser: string;
  tag: string;
  image: string;
  aiHint: string;
  offer: string;
  link: string;
  layout?: 'vertical' | 'default';
};

type CombinedItem = AdData | BlogData;

type CombinedCardProps = {
  item: CombinedItem;
};

export function CombinedCard({ item }: CombinedCardProps) {
  if (item.type === 'ad') {
    return <AdCard {...item} />;
  }
  if (item.type === 'blog') {
    return <BlogCard {...item} />;
  }
  return null;
}
