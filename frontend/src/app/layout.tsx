import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'BookFlow | Precision Service Scheduling',
  description: 'Modern booking automation for service businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('dark', inter.variable, manrope.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
