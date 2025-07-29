
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="my-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-center">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>
      <div className="prose prose-invert mx-auto">
        <p>
          Welcome to WillItTrend.com. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul>
            <li>
                <strong>Usage Data:</strong> We may automatically collect information about your access to and use of the Site. This information may include your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.
            </li>
            <li>
                <strong>Submitted Data:</strong> We collect the topics, ideas, and other inputs you voluntarily provide when using our AI forecasting and content generation tools.
            </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Use of Your Information</h2>
        <p>
          Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Operate and maintain the website.</li>
          <li>Improve our website and services.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          <li>Provide and deliver the products and services you request, process transactions, and send you related information.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">3. Disclosure of Your Information</h2>
        <p>
          We do not share, sell, rent, or trade your information with third parties for their commercial purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. Data Security</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">5. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:ai@incdrops.com" className="text-primary hover:underline">ai@incdrops.com</a>
        </p>
      </div>
    </div>
  );
}
