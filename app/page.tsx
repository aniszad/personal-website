import type { Viewport } from "next";
import { HOME_THEME } from "@/lib/constants";
import { resolveProjects } from "@/lib/resolve";
import { Hero } from "@/components/sections/Hero";
import { Masthead } from "@/components/layout/Masthead";
import { HomeFooterNote } from "@/components/layout/HomeFooterNote";

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function HomePage() {
  const limpscanner = resolveProjects().find((project) => project.slug === "limpscanner");
  if (!limpscanner) {
    throw new Error("Limpscanner project is missing from lib/data.ts");
  }

  return (
    <>
      <Masthead />

      <div className="mx-auto max-w-5xl px-6 pb-20 md:px-8 lg:px-14">
        <main id="content">
          <Hero limpscanner={limpscanner} />
        </main>

        <footer className="border-t border-line py-8">
          <HomeFooterNote />
        </footer>
      </div>
    </>
  );
}
