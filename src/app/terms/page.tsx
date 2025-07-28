
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </header>
      
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            By accessing and using WillItTrend.com (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
          </p>
        </CardContent>
      </Card>

      <Card className="glassmorphic mt-8">
        <CardHeader>
          <CardTitle>2. Service Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Our Service provides AI-powered trend analysis, content generation tools, and an API for programmatic access. The predictions and content generated are for informational purposes only.
          </p>
          <p>
            You acknowledge that the AI-generated outputs may not always be accurate, complete, or suitable for your specific needs. We are not liable for any decisions made based on the information provided by our Service.
          </p>
        </CardContent>
      </Card>
      
      <Card className="glassmorphic mt-8">
        <CardHeader>
          <CardTitle>3. User Conduct and Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            You are solely responsible for the content (e.g., topics, ideas) you submit to the Service. You agree not to submit any content that is unlawful, harmful, or infringes on the rights of others.
          </p>
          <p>
            We reserve the right to refuse service or terminate access for any user who violates these terms. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, process, and transmit this content as necessary to provide and improve the Service.
          </p>
        </CardContent>
      </Card>
      
      <Card className="glassmorphic mt-8">
        <CardHeader>
          <CardTitle>4. Disclaimer of Warranties</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            The Service is provided on an "as is" and "as available" basis. We make no warranty that the service will meet your requirements, be uninterrupted, timely, secure, or error-free. Any reliance you place on such information is therefore strictly at your own risk.
          </p>
        </CardContent>
      </Card>
      
      <Card className="glassmorphic mt-8">
        <CardHeader>
          <CardTitle>5. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            In no event shall WillItTrend.com, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
