
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="prose prose-invert mx-auto space-y-8">
        <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Welcome to WillItTrend.com ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
        </Card>

        <Card className="glassmorphic">
            <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
            <p>
                We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                <strong>Content You Provide:</strong> When you submit a trend, topic, or idea to our platform for analysis, we collect that content. This includes text submitted through the main input form, the AI tools, and via our API.
                </li>
                <li>
                <strong>API Usage Data:</strong> For users of our API, we collect information associated with your API key, such as the endpoints you access, the volume of requests, and timestamps, to manage billing, rate limits, and service quality.
                </li>
                <li>
                <strong>Anonymized Usage Data:</strong> We may collect anonymous data about how you interact with our service to help us improve our platform. This information is not personally identifiable.
                </li>
            </ul>
            </CardContent>
        </Card>

        <Card className="glassmorphic">
            <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
            <p>
                We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                <strong>To Provide and Improve Our Service:</strong> The content you submit is sent to third-party AI models (e.g., Google's Gemini) to generate trend forecasts and other content. We use your queries to power our core service.
                </li>
                <li>
                <strong>To Monitor and Secure Our Service:</strong> We use API usage data to enforce our terms of service, prevent abuse, and ensure fair usage across our tiers.
                </li>
                <li>
                <strong>For Research and Development:</strong> Anonymized data may be used to improve our AI models and develop new features. We do not use your personal information for this purpose.
                </li>
            </ul>
            </CardContent>
        </Card>
        
        <Card className="glassmorphic">
            <CardHeader>
            <CardTitle>Data Retention and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
            <p>We take reasonable measures to protect your information. However, no electronic transmission or storage is 100% secure. We retain user-submitted content and API logs as necessary to provide the service and for a reasonable period for analytical purposes.</p>
            <p>We do not require user accounts and therefore do not store personal information like names, email addresses (except for API-related communication), or passwords on our platform.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
