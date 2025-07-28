
<<<<<<< HEAD
import { Check, Sparkles } from 'lucide-react';
=======
'use client';
import { Check, Sparkles, LoaderCircle } from 'lucide-react';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
<<<<<<< HEAD
=======
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
import Link from 'next/link';

type PricingCardProps = {
  title: string;
  price?: number;
  description: string;
  features: string[];
  cta: string;
  isFeatured?: boolean;
  targetAudience: string;
<<<<<<< HEAD
  contactEmail?: string;
=======
  priceId?: string;
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
};

export function PricingCard({
  title,
  price,
  description,
  features,
  cta,
  isFeatured = false,
  targetAudience,
<<<<<<< HEAD
  contactEmail,
}: PricingCardProps) {

  const ctaButton = (
    <Button
      size="lg"
      variant={isFeatured ? 'shiny' : 'outline'}
      className="w-full mt-8"
    >
      {isFeatured && <Sparkles />}
      {cta}
    </Button>
  );
=======
  priceId,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCheckout = async () => {
    // This function is now only for Stripe checkout
    setIsLoading(true);
     if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be signed in to make a purchase. Please refresh the page.',
        });
        setIsLoading(false);
        return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          priceId,
          successUrl: `${window.location.origin}/?payment=success`,
          cancelUrl: window.location.href,
        }),
      });

      const { url, error, details } = await response.json();

      if (!response.ok) {
        throw new Error(error || details || 'An unknown error occurred.');
      }

      if (url) {
        window.location.href = url;
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: e.message,
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const isContactButton = cta === 'Contact Sales';
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090

  return (
    <div className={cn('relative group transition-transform duration-300 ease-in-out', isFeatured ? 'transform md:scale-110 z-10' : 'hover:scale-105')}>
      <Card className="glassmorphic rounded-2xl h-full flex flex-col relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
        {isFeatured && (
          <Badge className="absolute top-4 right-4" variant="default">Most Popular</Badge>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
          <CardDescription>{targetAudience}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
<<<<<<< HEAD
          <div className="text-center my-4 min-h-[56px] flex items-center justify-center">
            {price > 0 ? (
              <div>
                <span className="text-4xl font-extrabold">${price}</span>
                <span className="text-muted-foreground">/one-time</span>
              </div>
            ) : (
               <span className="text-2xl font-bold">Contact for Quote</span>
            )}
          </div>
=======
          {price !== undefined ? (
            <div className="text-center my-4">
              <span className="text-4xl font-extrabold">${price}</span>
              <span className="text-muted-foreground">/one-time</span>
            </div>
          ) : (
            <div className="text-center my-4">
              <span className="text-4xl font-extrabold">Custom</span>
            </div>
          )}
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
          <p className="text-center text-muted-foreground mb-6 min-h-[40px]">{description}</p>
          <ul className="space-y-3 flex-grow">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
<<<<<<< HEAD
          {contactEmail ? (
            <Link href={`mailto:${contactEmail}?subject=White%20Label%20Pricing%20Inquiry`}>
              {ctaButton}
            </Link>
          ) : (
            ctaButton
          )}
=======
          <Button
            size="lg"
            variant={isFeatured ? 'shiny' : 'outline'}
            className="w-full mt-8"
            onClick={!isContactButton ? handleCheckout : undefined}
            disabled={isLoading}
            asChild={isContactButton}
          >
             {isContactButton ? (
              <Link href="/pricing#contact">{cta}</Link>
             ) : (
                <>
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    {isFeatured && <Sparkles />}
                    {cta}
                  </>
                )}
                </>
             )}
          </Button>
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
        </CardContent>
      </Card>
    </div>
  );
}
