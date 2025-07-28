
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BrainCircuit, LayoutGrid, BarChart3 } from 'lucide-react';

export default function LearnMorePage() {
  const features = [
    {
      icon: <BrainCircuit className="w-10 h-10 text-primary" />,
      title: 'AI Trend Forecasting',
      description: 'Submit any idea, hashtag, or product. Our AI analyzes millions of data points, including market trends, social buzz, and competitive analysis, to deliver a trend score from 0-100.',
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-primary" />,
      title: 'Actionable Rationale',
      description: "Don't just get a score, understand it. Every forecast comes with a clear, AI-generated rationale explaining the key drivers behind the prediction, so you can make informed decisions.",
    },
    {
      icon: <LayoutGrid className="w-10 h-10 text-primary" />,
      title: 'Dynamic Results Feed',
      description: 'Explore a live feed of recent trend forecasts in a dynamic card layout. See what others are searching for and discover new opportunities in real-time.',
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      title: 'AI Content Co-Pilot',
      description: "Go from idea to execution instantly. Generate engaging captions and find the perfect hashtags for your trend with our integrated AI content tools, available right from your results.",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          How Trendcast AI Works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          We combine real-time data analysis with powerful AI to give you an unfair advantage in a fast-moving digital world.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="glassmorphic h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
