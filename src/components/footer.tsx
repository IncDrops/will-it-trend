
export function Footer() {
    return (
        <footer id="contact" className="container mx-auto px-4 py-6 mt-12 scroll-mt-20">
            <div className="text-center text-sm text-muted-foreground space-y-2">
                <div className="p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
                    <p>For enterprise inquiries or custom solutions, please email us at:</p>
                    <a href="mailto:ai@incdrops.com" className="text-primary hover:underline">ai@incdrops.com</a>
                </div>
                <p>&copy; {new Date().getFullYear()} WillItTrend.com. All Rights Reserved.</p>
                <p>Predictions are not guaranteed. Use at your own discretion.</p>
            </div>
        </footer>
    )
}
