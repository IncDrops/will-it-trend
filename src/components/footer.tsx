export function Footer() {
    return (
        <footer className="container mx-auto px-4 py-6 mt-12">
            <div className="text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} WillItTrend.com. All Rights Reserved.</p>
                <p>Predictions are not guaranteed. Use at your own discretion.</p>
            </div>
        </footer>
    )
}
