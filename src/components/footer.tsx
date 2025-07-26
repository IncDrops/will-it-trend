export function Footer() {
    return (
        <footer className="container mx-auto px-4 py-6 mt-12">
            <div className="text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Trendcast AI. All Rights Reserved.</p>
                <p>Powered by Firebase and Genkit.</p>
            </div>
        </footer>
    )
}
