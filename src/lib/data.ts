
export const sampleTrends = [
  {
    id: 1,
    query: '“Eco-friendly packaging reveals”',
    platform: 'Instagram',
    timer: '1h',
    score: 83,
    rationale: 'High engagement from sustainability-focused accounts and DIY communities.',
  },
  {
    id: 2,
    query: '“#AIcoversongs”',
    platform: 'TikTok',
    timer: '24h',
    score: 91,
    rationale: 'Explosive virality due to novelty and celebrity voice mimicry. Low barrier to entry.',
  },
  {
    id: 3,
    query: '“Vintage tech teardowns”',
    platform: 'YouTube',
    timer: '7 days',
    score: 76,
    rationale: 'Consistent growth in niche tech and nostalgia communities. High-quality content is key.',
  },
  {
    id: 4,
    query: '“Main character energy” meme',
    platform: 'Twitter',
    timer: '3h',
    score: 88,
    rationale: 'Relatable concept spreading rapidly through quote tweets and commentary channels.',
  },
  {
    id: 5,
    query: '“Butter board” recipes',
    platform: 'Pinterest',
    timer: '3 days',
    score: 68,
    rationale: 'Steady interest in food and hosting niches, but may be nearing saturation point.',
  },
   {
    id: 6,
    query: '“Hyper-realistic cake decorating”',
    platform: 'TikTok',
    timer: '6h',
    score: 95,
    rationale: 'Visually stunning content with a high "wow" factor, driving shares and comments.',
  },
];

export type AdData = {
  type: 'ad';
  id: string; 
  originalId: string;
  industry: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  aiHint: string;
};

export type BlogData = {
  type: 'blog';
  id: string; 
  originalId: string;
  title: string;
  teaser: string;
  tag: string;
  image?: string;
  aiHint?: string;
  offer: string;
  link: string;
};

export type ContentItem = AdData | BlogData;


// This data is now seeded into Firestore and will be fetched from there.
// See /src/hooks/use-content.ts and the seeding script.
export const contentData: ContentItem[] = [
  {
    type: 'ad' as const,
    id: '1',
    originalId: '1',
    industry: 'Automobile',
    title: 'The Future is Electric. Drive the Revolution.',
    description: 'Introducing the new luxury EV. Unmatched performance and design.',
    cta: 'Explore Now',
    link: 'https://amzn.to/4obEfN2',
    image: 'https://placehold.co/1200x600',
    aiHint: 'luxury EV magazine'
  },
    {
    type: 'blog' as const,
    id: '2',
    originalId: '2',
    title: 'How to Profit From the Next Social Media Hashtag Boom',
    teaser: 'Discover the tools and strategies to identify and capitalize on trending hashtags before they go viral.',
    tag: 'Social Media',
    offer: 'Read on Amazon',
    link: 'https://amzn.to/4obEfN2',
  },
  {
    type: 'ad' as const,
    id: '3',
    originalId: '3',
    industry: 'Tech',
    title: 'Powering the AI Era.',
    description:
      'Next-generation semiconductors for unparalleled AI processing power.',
    cta: 'Learn More',
    link: '/learn-more',
    image: 'https://placehold.co/600x400',
    aiHint: 'semiconductor chip'
  },
    {
    type: 'blog' as const,
    id: '4',
    originalId: '4',
    title: 'Best Gadgets for Early Adopters: 2025 Picks',
    teaser: 'A curated list of the most innovative and game-changing gadgets set to launch in the coming year.',
    tag: 'Technology',
    image: 'https://placehold.co/1200x600',
    aiHint: 'futuristic gadget magazine',
    offer: 'Shop on Amazon',
    link: 'https://amzn.to/4obEfN2'
  },
   {
    type: 'ad' as const,
    id: '5',
    originalId: '5',
    industry: 'Mobile Smart Devices',
    title: 'Experience Brilliance.',
    description: 'The latest flagship phone with a revolutionary camera system.',
    cta: 'Pre-order Today',
    link: '#',
    image: 'https://placehold.co/375x812',
    aiHint: 'smartphone tech',
  },
   {
    type: 'blog' as const,
    id: '6',
    originalId: '6',
    title: 'AI Trend Forecasting Tools for Marketers',
    teaser: 'A deep dive into the AI platforms that are revolutionizing marketing by predicting consumer behavior.',
    tag: 'AI & Marketing',
    image: 'https://placehold.co/600x400',
    aiHint: 'marketing dashboard',
    offer: 'Explore Our API',
    link: '/docs'
  },
  {
    type: 'ad' as const,
    id: '7',
    originalId: '7',
    industry: 'Software',
    title: 'Build, Collaborate, and Scale.',
    description: 'Our cloud SaaS platform empowers teams to achieve more.',
    cta: 'Start Free Trial',
    link: '#',
    image: 'https://placehold.co/600x600',
    aiHint: 'software interface'
  },
    {
    type: 'blog' as const,
    id: '8',
    originalId: '8',
    title: 'The Rise of Sustainable Tech: What to Watch',
    teaser: 'From green energy solutions to circular economy gadgets, explore the sustainable tech trends shaping our future.',
    tag: 'Sustainability',
    image: 'https://placehold.co/600x400',
    aiHint: 'sustainable tech',
    offer: 'Shop Smart Gardens',
    link: 'https://amzn.to/4obEfN2'
  },
  {
    type: 'ad' as const,
    id: '9',
    originalId: '9',
    industry: 'Finance/Fintech',
    title: 'Invest Smarter, Not Harder.',
    description: 'Our AI-driven platform helps you navigate the markets with confidence.',
    cta: 'See Investment Trends',
    link: '#',
    image: 'https://placehold.co/600x600',
    aiHint: 'finance chart crypto',
  },
   {
    type: 'blog' as const,
    id: '10',
    originalId: '10',
    title: 'Decoding Gen Z: How They Drive Digital Trends',
    teaser: 'Understand the platforms, aesthetics, and values that make Gen Z the most powerful force in trend creation.',
    tag: 'Culture',
    image: 'https://placehold.co/1200x600',
    aiHint: 'gen z fashion magazine',
    offer: 'Shop Vlogging Kits',
    link: 'https://amzn.to/4obEfN2'
  }
];
