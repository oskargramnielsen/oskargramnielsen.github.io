import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { fontDisplay, fontSans } from '@/lib/fonts';
import { Toaster } from '@/components/ui/toaster';
import { CustomCursor } from '@/components/interactive/custom-cursor';

export const metadata: Metadata = {
  metadataBase: new URL('https://oskargramnielsen.github.io'),
  title: {
    default: 'OGN - Hyper-Modern Portfolio',
    template: '%s | OGN'
  },
  description: 'Portfolio and digital resume of Oskar Gram Nielsen - automation engineer crafting future-ready workflows.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <CustomCursor />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
