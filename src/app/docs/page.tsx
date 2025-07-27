
import { ApiDocsV2 } from '@/components/api-docs-v2';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          API Documentation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Integrate our trend intelligence and AI content tools into your own application.
        </p>
      </header>
      <ApiDocsV2 />
    </div>
  );
}
