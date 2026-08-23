import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { HOME_THEME, SITE, SOCIALS } from "@/lib/constants";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { HomeSideNav } from "@/components/layout/HomeSideNav";
import { RetroComputerShell } from "@/components/layout/RetroComputerShell";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { CommandPalette } from "@/components/ui/CommandPalette";
import "@/styles/globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.title,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lille",
    addressCountry: "FR",
  },
  sameAs: [SOCIALS.github, SOCIALS.linkedin],
};

/** Primary interface and display face. */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

/** Technical metadata, tags, and command-line details. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
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
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
  },
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
    images: [
      {
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.title}`,
    description: SITE.description,
    images: [`${SITE.url}/opengraph-image`],
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
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <LanguageProvider>
          <RetroComputerShell>
            <HomeSideNav />
            {children}
          </RetroComputerShell>
          <ChatWidget />
          <CommandPalette />
        </LanguageProvider>

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
