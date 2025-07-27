
'use client';

import { CodeBlock } from '@/components/code-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AiTools } from './ai-tools';

const baseUrl = "https://<YOUR_PROJECT_ID>.web.app/api";

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

const captionsRequest = `curl -X POST "${baseUrl}/v1/generate-captions" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "A new sustainable sneaker brand",
    "tone": "casual"
  }'`;
  
const captionsResponse = `{
  "captions": [
    "Step up your shoe game, sustainably.",
    "Good for your feet, great for the planet.",
    "Finally, sneakers you can feel good about wearing."
  ]
}`;


export function ApiDocsV2() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Introduction */}
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Our API provides programmatic access to trend intelligence and a suite of AI-powered content tools. All endpoints require an API key and are rate-limited based on your plan.
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
                <Link href="/openapi.v2.yaml" target="_blank">Download OpenAPI Spec v2</Link>
            </Button>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Endpoints</h2>
        
        <Tabs defaultValue="predict" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predict">Trend Prediction</TabsTrigger>
                <TabsTrigger value="content">Content Generation</TabsTrigger>
            </TabsList>
            <TabsContent value="predict">
                <Card className="glassmorphic">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="text-base bg-blue-800 text-white">POST</Badge>
                            <CardTitle className="m-0">/v1/predict</CardTitle>
                        </div>
                        <CardDescription className="pt-2">
                            Get an AI-powered prediction for a specific topic, including confidence score, key drivers, and a recommended action.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-semibold text-lg mb-2">Example Request</h4>
                        <CodeBlock language="bash" code={predictRequest} />
                        <h4 className="font-semibold text-lg mt-4 mb-2">Example Response</h4>
                        <CodeBlock language="json" code={predictResponse} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="content">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>AI Content Suite</CardTitle>
                        <CardDescription>
                           Go from trend to content in seconds. These endpoints leverage the same AI that powers our web tools to generate captions, find hashtags, and recommend the best time to post.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Badge variant="secondary" className="text-base bg-blue-800 text-white">POST</Badge>
                                    <h3 className="font-mono text-lg">/v1/generate-captions</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">Generate 5 engaging captions from a topic and tone.</p>
                                <CodeBlock language="bash" code={captionsRequest} />
                            </div>
                             <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Badge variant="secondary" className="text-base bg-blue-800 text-white">POST</Badge>
                                    <h3 className="font-mono text-lg">/v1/find-hashtags</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Get 10-15 optimal hashtags for a topic.</p>
                            </div>
                             <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Badge variant="secondary" className="text-base bg-blue-800 text-white">POST</Badge>
                                    <h3 className="font-mono text-lg">/v1/best-time-to-post</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Find the single best time to post based on industry and platform.</p>
                            </div>
                       </div>
                       
                        <h4 className="font-semibold text-lg mt-8 mb-4 text-center">Live Demo</h4>
                        <p className="text-muted-foreground text-center mb-4">Use the tools below to see the API in action.</p>
                        <div className="border rounded-xl p-4">
                           <AiTools />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

