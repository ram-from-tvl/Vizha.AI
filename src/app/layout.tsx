import '@/styles/globals.css';
import type { Metadata } from 'next';
import { TamboWrapper } from '@/components/TamboWrapper';

export const metadata: Metadata = {
  title: 'AI Event Platform - Hackathons, Conferences & More',
  description: 'AI-powered event management platform for organizing and attending hackathons, conferences, workshops, and meetups.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <TamboWrapper>
          {children}
        </TamboWrapper>
      </body>
    </html>
  );
}