import type { Metadata, Viewport } from "next";
import { HOME_THEME, getPage } from "@/lib/constants";
import { resolveExperiences } from "@/lib/resolve";
import { PageShell } from "@/components/layout/PageShell";
import { Experience } from "@/components/sections/Experience";

const page = getPage("/experience");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function ExperiencePage() {
  // Company logos are matched against /public at build time, so a role with no
  // logo file renders as text alone.
  const entries = resolveExperiences();

  return (
    <PageShell page={page}>
      <Experience entries={entries} />
    </PageShell>
  );
}
