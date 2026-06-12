import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EcoAura — Know Your Carbon Footprint',
  description: 'Discover your EcoAura through an AI-powered quiz. Track, understand, and reduce your annual carbon footprint with personalized insights and micro-actions.',
  keywords: ['carbon footprint', 'ecoaura', 'sustainability', 'carbon calculator', 'climate action'],
  authors: [{ name: 'EcoAura Team' }],
  openGraph: {
    title: 'EcoAura — Know Your Carbon Footprint',
    description: 'Discover your EcoAura and take action to reduce your footprint.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
