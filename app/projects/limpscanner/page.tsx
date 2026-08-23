import type { Metadata, Viewport } from "next";
import { getPage } from "@/lib/constants";
import { ThemeStyle } from "@/components/layout/ThemeStyle";
import { LimpScannerCaseStudy } from "@/components/sections/LimpScannerCaseStudy";

const page = getPage("/projects");

export const metadata: Metadata = {
  title: "Limpscanner",
  description: "A production browser barcode scanner built for real retail devices.",
  alternates: { canonical: "/projects/limpscanner" },
};

export const viewport: Viewport = {
  themeColor: page.theme.surface,
  colorScheme: "dark",
};

export default function LimpscannerPage() {
  return (
    <>
      <ThemeStyle theme={page.theme} />
      <div className="md:pl-72 lg:pl-80">
        <main id="content">
          <LimpScannerCaseStudy />
        </main>
      </div>
    </>
  );
}
