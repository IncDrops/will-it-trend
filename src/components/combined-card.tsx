import { AdCard } from './ad-card';
import { BlogCard } from './blog-card';

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
