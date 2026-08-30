import type { Metadata, Viewport } from "next";
import { HOME_THEME, getPage } from "@/lib/constants";
import { PageShell } from "@/components/layout/PageShell";
import { About } from "@/components/sections/About";

const page = getPage("/about");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

// Carries the section colour into the mobile browser chrome, so the address bar
// changes with the page rather than staying on the index navy.
export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function AboutPage() {
  return (
    <PageShell page={page}>
      <About />
    </PageShell>
  );
}
