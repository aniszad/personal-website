import type { Metadata, Viewport } from "next";
import { HOME_THEME, getPage } from "@/lib/constants";
import { PageShell } from "@/components/layout/PageShell";
import { Skills } from "@/components/sections/Skills";

const page = getPage("/skills");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function SkillsPage() {
  return (
    <PageShell page={page}>
      <Skills />
    </PageShell>
  );
}
