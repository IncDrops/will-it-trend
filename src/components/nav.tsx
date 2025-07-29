
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/', label: 'Dashboard' },
  { href: '/learn-more', label: 'Learn More' },
  { href: '/tools', label: 'AI Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'API Docs' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              WillItTrend.com
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === route.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="mb-4 flex items-center space-x-2"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold">WillItTrend.com</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                         pathname === route.href ? 'text-foreground font-semibold' : 'text-foreground/60'
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button variant="shiny" size="sm" asChild>
            <Link href="/#input-section">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
