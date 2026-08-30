import type { Metadata, Viewport } from "next";
import { HOME_THEME, getPage } from "@/lib/constants";
import { resolveEducation } from "@/lib/resolve";
import { PageShell } from "@/components/layout/PageShell";
import { Education } from "@/components/sections/Education";

const page = getPage("/education");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function EducationPage() {
  // Logos are matched against /public at build time, so an institution without
  // a logo file falls back to an initials badge instead of a broken image.
  const entries = resolveEducation();

  return (
    <PageShell page={page}>
      <Education entries={entries} />
    </PageShell>
  );
}
