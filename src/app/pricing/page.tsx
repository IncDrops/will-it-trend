
import { PricingCard } from '@/components/pricing-card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      title: 'Starter Pack',
      price: 9.99,
      description: 'Perfect for solo creators testing the waters.',
      features: [
        'Up to 20 Trend Reports',
        '100 AI Credits',
        'Full access to AI Tools',
      ],
      cta: 'Get Started',
      isFeatured: false,
      targetAudience: 'Solo creators',
<<<<<<< HEAD
      link: '/#input-section',
    },
    {
      title: 'Pro AI',
      price: 49.99,
=======
      priceId: 'price_1RpMQpHK4G9ZDA0F4OJxhrD6',
    },
    {
      title: 'Pro AI Pack',
      price: 29.99,
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
      description: 'For marketing teams and agencies managing multiple clients.',
      features: [
<<<<<<< HEAD
        'Unlimited Trend Reports',
<<<<<<< HEAD
=======
=======
        'Up to 100 Trend Reports',
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
        '500 AI Credits',
        'API Access for integrations',
        'Priority Support',
      ],
<<<<<<< HEAD
      cta: 'Choose Pro AI',
      isFeatured: true,
      targetAudience: 'Marketing teams',
      link: '/#input-section',
=======
      cta: 'Choose Pro',
      isFeatured: true,
      targetAudience: 'Marketing teams',
      priceId: 'price_1RpMgKHK4G9ZDA0FawwsKgsK',
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
    },
    {
<<<<<<< HEAD
      title: 'White Label',
<<<<<<< HEAD
      price: null,
=======
      price: 0,
=======
      title: 'Enterprise',
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
      description: 'For businesses wanting to offer our reports under their own brand.',
      features: [
        'Everything in Pro AI Pack',
        'Custom Branded Reports',
        'Dedicated Account Manager',
        'White-label options',
      ],
      cta: 'Contact for Quote',
      isFeatured: false,
      targetAudience: 'Influencers & Agencies',
<<<<<<< HEAD
      link: '/contact',
=======
<<<<<<< HEAD
      contactEmail: 'ai@incdrops.com',
=======
      priceId: '', // No price ID for contact sales
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
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
<<<<<<< HEAD
            link={plan.link}
=======
<<<<<<< HEAD
            contactEmail={plan.contactEmail}
=======
            priceId={plan.priceId}
>>>>>>> 20a0f1202cfd5154a93bfd1a3c582e3aeb209090
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
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
