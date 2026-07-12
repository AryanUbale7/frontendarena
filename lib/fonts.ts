import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash-display',
  display: 'swap',
  weight: '200 700'
});

export const generalSans = localFont({
  src: '../public/fonts/GeneralSans-Variable.woff2',
  variable: '--font-general-sans',
  display: 'swap',
  weight: '200 700'
});
