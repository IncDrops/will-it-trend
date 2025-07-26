import { Clock, Quote, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type TrendCardProps = {
  query: string;
  timer: string;
  score: number;
  rationale: string;
  isSample?: boolean;
  className?: string;
};

export function TrendCard({
  query,
  timer,
  score,
  rationale,
  isSample = false,
  className,
}: TrendCardProps) {
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-400';
    if (score > 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className={cn("relative h-full group", className)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Card className="glassmorphic rounded-xl h-full transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:shadow-primary/20 relative">
        <CardHeader>
          {isSample && <Badge variant="secondary" className="absolute top-4 right-4">Sample</Badge>}
          <CardTitle className="flex items-start gap-3">
             <Quote className="w-8 h-8 text-primary/80 shrink-0 mt-1" />
            <span className="text-lg font-semibold">{query}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trend Score</p>
              <p className={cn(
                  "text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br",
                  score > 80 && "from-green-400 to-cyan-400",
                  score > 60 && score <= 80 && "from-yellow-400 to-orange-400",
                  score <= 60 && "from-orange-400 to-red-500",
                )}>
                {score}
                <span className="text-3xl">%</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{timer}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> AI Rationale</p>
            <p className="text-foreground/90">{rationale}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
