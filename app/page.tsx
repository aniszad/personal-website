import type { Viewport } from "next";
import { HOME_THEME } from "@/lib/constants";
import { ThemeStyle } from "@/components/layout/ThemeStyle";
import { Hero } from "@/components/sections/Hero";
import { IndexNav } from "@/components/layout/IndexNav";
import { HomeFooterNote } from "@/components/layout/HomeFooterNote";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { PlanetHeroLoader } from "@/components/ui/PlanetHeroLoader";

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

/**
 * Index.
 *
 * Two screens rather than one page. The first is nothing but the masthead and
 * the portrait, which gives a visitor something to react to before it asks them
 * to choose anything. The listing sits below it, so reaching the sections is a
 * deliberate scroll rather than the first thing in view.
 */
export default function HomePage() {
  return (
    <>
      <ThemeStyle theme={HOME_THEME} />

      <div className="mx-auto max-w-5xl px-6 pb-14 pt-8 md:px-10 md:pb-20">
        <main id="content">
          <Hero portrait={<PlanetHeroLoader />} />

          <div className="pt-16 md:pt-24">
            <IndexNav />
          </div>
        </main>

        <footer className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SocialLinks />
          <HomeFooterNote />
        </footer>
      </div>
    </>
  );
}
