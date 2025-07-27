import { PricingCard } from '@/components/pricing-card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      title: 'Starter Pack',
      price: 9.99,
      description: 'Perfect for solo creators testing the waters.',
      features: [
        '5 Trend Reports',
        '50 AI Credits',
        'Full access to AI Tools',
      ],
      cta: 'Get Started',
      isFeatured: false,
      targetAudience: 'Solo creators',
      priceId: 'price_1PQRrJ07gM2Zl2p9iJj9E9T8', // REPLACE WITH YOUR STARTER PRICE ID
    },
    {
      title: 'Pro AI Pack',
      price: 29.99,
      description: 'For marketing teams and agencies managing multiple clients.',
      features: [
        'Unlimited Trend Reports',
        '500 AI Credits',
        'API Access for integrations',
        'Priority Support',
      ],
      cta: 'Choose Pro',
      isFeatured: true,
      targetAudience: 'Marketing teams',
      priceId: 'price_1PQRrJ07gM2Zl2p9jYh9H8g7', // REPLACE WITH YOUR PRO PRICE ID
    },
    {
      title: 'Enterprise',
      description: 'For businesses wanting to offer our reports under their own brand.',
      features: [
        'Everything in Pro AI Pack',
        'Custom Branded Reports',
        'Dedicated Account Manager',
        'White-label options',
      ],
      cta: 'Contact Sales',
      isFeatured: false,
      targetAudience: 'Influencers & Agencies',
      priceId: '', // No price ID for contact sales
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Find the Perfect Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Simple, one-time payments. Get the insights you need without a
          recurring subscription.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        {plans.map((plan) => (
          <PricingCard
            key={plan.title}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            cta={plan.cta}
            isFeatured={plan.isFeatured}
            targetAudience={plan.targetAudience}
            priceId={plan.priceId}
          />
        ))}
      </div>
       <div className="text-center mt-16 text-muted-foreground text-sm">
        <p>All payments are processed securely through Stripe. We do not store your payment information.</p>
        <p>Due to the nature of digital goods, we do not offer refunds. Please choose your plan carefully.</p>
      </div>
    </div>
  );
}
