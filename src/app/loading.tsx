import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">
          Loading Trendcast AI...
        </h1>
      </div>
    </div>
  );
}
