import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

type PricingCardProps = {
  title: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  isFeatured?: boolean;
  targetAudience: string;
};

export function PricingCard({
  title,
  price,
  description,
  features,
  cta,
  isFeatured = false,
  targetAudience,
}: PricingCardProps) {
  return (
    <div className={cn('relative', isFeatured && 'transform md:scale-110 z-10')}>
      {isFeatured && (
        <div className="absolute -inset-1.5 bg-gradient-animated rounded-2xl blur-lg" />
      )}
      <Card className="glassmorphic rounded-2xl h-full flex flex-col relative">
        {isFeatured && (
          <Badge className="absolute top-4 right-4" variant="default">Most Popular</Badge>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
          <CardDescription>{targetAudience}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div className="text-center my-4">
            <span className="text-4xl font-extrabold">${price}</span>
            <span className="text-muted-foreground">/one-time</span>
          </div>
          <p className="text-center text-muted-foreground mb-6 min-h-[40px]">{description}</p>
          <ul className="space-y-3 flex-grow">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            variant={isFeatured ? 'shiny' : 'outline'}
            className="w-full mt-8"
          >
            {isFeatured && <Sparkles />}
            {cta}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
