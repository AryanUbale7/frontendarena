import type { Metadata } from 'next';
import { jetbrainsMono, clashDisplay, generalSans } from '@/lib/fonts';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Frontend Arena',
    template: '%s | Frontend Arena',
  },
  description: 'The ultimate battleground for frontend developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://frontendarena.com'),
  openGraph: {
    title: 'Frontend Arena',
    description: 'The ultimate battleground for frontend developers.',
    url: 'https://frontendarena.com',
    siteName: 'Frontend Arena',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontend Arena',
    description: 'The ultimate battleground for frontend developers.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Frontend Arena",
              "url": "https://frontendarena.com",
              "logo": "https://frontendarena.com/next.svg",
              "sameAs": [
                "https://twitter.com/frontendarena",
                "https://github.com/frontendarena"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${clashDisplay.variable} ${generalSans.variable} ${cinzel.variable} antialiased min-h-screen bg-background text-text-primary selection:bg-accent-violet selection:text-white`}
      >
        <GrainOverlay />
        <div className="flex flex-col min-h-screen relative">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
