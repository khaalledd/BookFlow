import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VerdantBook | Booking System',
  description:
    'Move clients from DMs to a calm, professional booking page and business dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('light', manrope.variable)}>
      <body className="min-h-screen bg-background font-body-md text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col">
        {children}
      </body>
    </html>
  );
}
