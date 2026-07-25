import type { Metadata, Viewport } from "next";
import { getPage } from "@/lib/constants";
import { PageShell } from "@/components/layout/PageShell";
import { Contact } from "@/components/sections/Contact";

const page = getPage("/contact");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

export const viewport: Viewport = {
  themeColor: page.theme.surface,
  colorScheme: "dark",
};

export default function ContactPage() {
  return (
    <PageShell page={page}>
      <Contact />
    </PageShell>
  );
}
