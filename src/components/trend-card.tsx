import { Flame, Cpu, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TrendCardProps = {
  query: string;
  timer: string;
  score: number;
  rationale: string;
  platform?: string;
  isSample?: boolean;
  className?: string;
};

export function TrendCard({
  query,
  timer,
  score,
  rationale,
  platform = 'TikTok',
  isSample = false,
  className,
}: TrendCardProps) {
  
  const getScoreClass = (score: number) => {
    if (score > 80) return "from-green-400 to-cyan-400";
    if (score > 60) return "from-yellow-400 to-orange-400";
    return "from-orange-400 to-red-500";
  };
  
  return (
      <Card className={cn("glassmorphic rounded-2xl h-full flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20", className)}>
        <CardHeader>
          {isSample && <Badge variant="secondary" className="absolute top-4 right-4">Sample</Badge>}
          <CardTitle className="flex items-start gap-3">
             <Flame className="w-8 h-8 text-primary/80 shrink-0 mt-1" />
            <span className="text-lg font-semibold">{query}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Badge variant="outline">{platform}</Badge>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{Math.round(score * 1.5)}% in {timer}</span>
                </div>
           </div>

          <div>
              <p className="text-sm text-muted-foreground mb-1">Prediction Confidence</p>
              <p className={cn("text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br", getScoreClass(score))}>
                {score}<span className="text-3xl">%</span>
              </p>
            </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><Cpu className="w-4 h-4" /> AI Rationale</p>
            <p className="text-foreground/90 text-sm">{rationale}</p>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button className="w-full" variant="outline" asChild>
            <Link href={`/tools?topic=${encodeURIComponent(query)}`}>Generate Post Ideas</Link>
          </Button>
        </div>
      </Card>
  );
}
