

import { CodeBlock } from '@/components/code-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';

const baseUrl = "https://<YOUR_PROJECT_ID>.web.app/api";

const getTrendsRequest = `curl -X GET "${baseUrl}/v1/trends" \\
  -H "x-api-key: YOUR_API_KEY"`;

const getTrendsResponse = `{
  "message": "Trends endpoint hit successfully.",
  "data": [
    {
      "trend": "#SampleTrend",
      "score": 95
    }
    // ... more trends based on tier
  ]
}`;

const predictRequest = `curl -X POST "${baseUrl}/v1/predict" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "AI-powered gardening tools"
  }'`;

const predictResponse = `{
  "message": "Predict endpoint hit successfully.",
  "prediction": {
    "confidenceScore": 88,
    "keyDrivers": [
      "Growing interest in home automation.",
      "Increased focus on sustainable living.",
      "Mentions in tech and lifestyle blogs."
    ],
    "recommendedAction": "Target ads towards tech-savvy homeowners on Instagram and Pinterest."
  }
}`;

const errorResponse = `{
  "error": "Hourly request limit exceeded. Please upgrade your plan."
}`;

export function ApiDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Introduction */}
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Our API provides programmatic access to trend intelligence. All endpoints require an API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <p className="text-sm text-muted-foreground">All API endpoints are relative to this base URL. Replace <code>{'<YOUR_PROJECT_ID>'}</code> with your actual Firebase project ID.</p>
                <CodeBlock language="bash" code={baseUrl} />
            </div>
             <div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground">Authenticate your requests by including your API key in the <code>x-api-key</code> header.</p>
            </div>
            <Button asChild variant="outline">
                <Link href="/openapi.yaml" target="_blank">Download OpenAPI Spec</Link>
            </Button>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Endpoints</h2>
        
        {/* GET /v1/trends */}
        <Card className="glassmorphic">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-base bg-green-800 text-white">GET</Badge>
                    <CardTitle className="m-0">/v1/trends</CardTitle>
                </div>
                <CardDescription className="pt-2">
                    Fetch a list of current top trends. The number of results depends on your API tier.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold text-lg mb-2">Example Request</h4>
                <CodeBlock language="bash" code={getTrendsRequest} />
                <h4 className="font-semibold text-lg mt-4 mb-2">Example Response</h4>
                <CodeBlock language="json" code={getTrendsResponse} />
            </CardContent>
        </Card>

        {/* POST /v1/predict */}
        <Card className="glassmorphic">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-base bg-blue-800 text-white">POST</Badge>
                    <CardTitle className="m-0">/v1/predict</CardTitle>
                </div>
                <CardDescription className="pt-2">
                    Get an AI-powered prediction for a specific topic.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Body Parameters</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><code>topic</code> (string, required): The topic, keyword, or idea you want to analyze.</li>
                    </ul>
                </div>
                <h4 className="font-semibold text-lg mb-2">Example Request</h4>
                <CodeBlock language="bash" code={predictRequest} />
                <h4 className="font-semibold text-lg mt-4 mb-2">Example Response</h4>
                <CodeBlock language="json" code={predictResponse} />
            </CardContent>
        </Card>
        
        {/* Errors */}
        <Card className="glassmorphic border-destructive/50">
            <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                    If you exceed your rate limit, you will receive a <code>429 Too Many Requests</code> response.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <h4 className="font-semibold text-lg mt-4 mb-2">Example Error Response</h4>
                <CodeBlock language="json" code={errorResponse} />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
