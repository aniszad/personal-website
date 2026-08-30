import type { Metadata, Viewport } from "next";
import { HOME_THEME } from "@/lib/constants";
import { resolveProjects } from "@/lib/resolve";
import { Masthead } from "@/components/layout/Masthead";
import { LimpScannerCaseStudy } from "@/components/sections/LimpScannerCaseStudy";

export const metadata: Metadata = {
  title: "Limpscanner",
  description: "A production browser barcode scanner built for real retail devices.",
  alternates: { canonical: "/projects/limpscanner" },
};

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function LimpscannerPage() {
  const project = resolveProjects().find((candidate) => candidate.slug === "limpscanner");
  if (!project) {
    throw new Error("Limpscanner project is missing from lib/data.ts");
  }

  return (
    <>
      <Masthead />
      <main id="content">
        <LimpScannerCaseStudy project={project} />
      </main>
    </>
  );
}
