
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="container mx-auto px-4 py-6 mt-12">
            <div className="text-center text-sm text-muted-foreground">
                <div className="flex justify-center gap-4 mb-2">
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} WillItTrend.com. All Rights Reserved.</p>
                <p>Predictions are not guaranteed. Use at your own discretion.</p>
            </div>
        </footer>
    )
}
