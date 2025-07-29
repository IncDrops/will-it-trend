
<<<<<<< HEAD
=======
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Copy } from 'lucide-react';


>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
<<<<<<< HEAD
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          For sales, support, or any other inquiries, please reach out to us.
        </p>
      </header>
      <div className="max-w-md mx-auto glassmorphic p-8 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">Our Email</h2>
        <p className="text-lg text-primary font-mono">ai@incdrops.com</p>
        <p className="text-sm text-muted-foreground mt-4">We typically respond within 24 business hours.</p>
=======
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about our trend analysis, API, or white-label solutions? We'd love to hear from you.
        </p>
      </header>

      <div className="flex justify-center">
        <Card className="glassmorphic max-w-lg w-full">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Email Us</CardTitle>
                <CardDescription>
                    The best way to reach us is by email. We aim to respond to all inquiries within 24 hours.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-lg font-mono p-4 bg-muted rounded-lg border border-border/20">
                    ai@incdrops.com
                </div>
                 <p className="text-xs text-muted-foreground mt-4">
                    Click the address to copy it to your clipboard.
                </p>
            </CardContent>
        </Card>
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
      </div>
    </div>
  );
}
