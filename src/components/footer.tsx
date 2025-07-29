<<<<<<< HEAD
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-6 mt-12">
      <div className="text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} WillItTrend.com. All Rights Reserved.</p>
        <p>Predictions are not guaranteed. Use at your own discretion.</p>
      </div>
    </footer>
  );
=======

import Link from 'next/link';

export function Footer() {
    return (
        <footer id="contact" className="container mx-auto px-4 py-6 mt-12 scroll-mt-20">
            <div className="text-center text-sm text-muted-foreground space-y-4">
                <div className="flex justify-center gap-4 mb-2">
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                </div>
                <div>
                    <p>&copy; {new Date().getFullYear()} WillItTrend.com. All Rights Reserved.</p>
                    <p>Predictions are not guaranteed. Use at your own discretion.</p>
                </div>
            </div>
        </footer>
    )
>>>>>>> b7983d82e07580e44754abb1e3efcfeba2a5181f
}
