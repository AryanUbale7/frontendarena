import type { Metadata } from 'next';
import { jetbrainsMono, clashDisplay, generalSans } from '@/lib/fonts';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Frontend Arena',
    template: '%s | Frontend Arena',
  },
  description: 'The ultimate battleground for frontend developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://frontendarena.online'),
  openGraph: {
    title: 'Frontend Arena',
    description: 'The ultimate battleground for frontend developers.',
    url: 'https://frontendarena.online',
    siteName: 'Frontend Arena',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontend Arena',
    description: 'The ultimate battleground for frontend developers.',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'google7444c53e01171196',
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
        {/* Preconnect to speed up Supabase and font requests */}
        <link rel="preconnect" href="https://tmdoeuoiknrciwcguhga.supabase.co" />
        <link rel="dns-prefetch" href="https://tmdoeuoiknrciwcguhga.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Frontend Arena",
              "url": "https://frontendarena.online",
              "logo": "https://frontendarena.online/next.svg",
              "sameAs": [
                "https://twitter.com/frontendarena",
                "https://github.com/frontendarena"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${clashDisplay.variable} ${generalSans.variable} antialiased min-h-screen bg-background text-text-primary selection:bg-accent-violet selection:text-white`}
      >
        <GrainOverlay />
        <div className="flex flex-col min-h-screen relative">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
