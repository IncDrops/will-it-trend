import { AiTools } from '@/components/ai-tools';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          AI Content Co-Pilot
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Generate ready-to-use captions, hashtags, and find the best time to post.
        </p>
      </header>
      <AiTools />
    </div>
  );
}
