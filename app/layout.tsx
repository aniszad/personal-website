import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { HOME_THEME, SITE } from "@/lib/constants";
import { Ambient } from "@/components/layout/Ambient";
import "@/styles/globals.css";

/** Body and interface text. Variable weight, so no weight list is needed. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Display face, used for headings and anything set large. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}, ${SITE.title}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name}, ${SITE.title}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.title}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Default only. Each page overrides themeColor with its own surface. */
export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-body antialiased">
        {/*
          First tab stop on the page. Visually hidden until focused, at which
          point it becomes a normal button so keyboard users can jump past the
          navigation.
        */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-surface"
        >
          Skip to content
        </a>

        {/*
          Mounted here rather than per page, outside the route template, for two
          reasons. The template fades its subtree on every navigation, and the
          wash fading out and back in would read as a flicker instead of as one
          colour becoming another. It also means the slow drift survives a
          navigation rather than restarting from the top each time.
        */}
        <Ambient />

        {children}

        {/*
          Vercel's own page view beacon: cookieless and collects no personal
          data, which is what lets an EU facing site skip a consent banner.
          It only reports anything once Web Analytics is switched on for this
          project in the Vercel dashboard; until then the script loads and
          silently does nothing.
        */}
        <Analytics />
      </body>
    </html>
  );
}
