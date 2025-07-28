
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
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
      </div>
    </div>
  );
}
