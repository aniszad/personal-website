import type { Viewport } from "next";
import { HOME_THEME } from "@/lib/constants";
import { ThemeStyle } from "@/components/layout/ThemeStyle";
import { Hero } from "@/components/sections/Hero";
import { HomeSideNav } from "@/components/layout/HomeSideNav";
import { HomeFooterNote } from "@/components/layout/HomeFooterNote";

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

/**
 * Index.
 *
 * The masthead and the pitch, with every destination reachable from the rail
 * on the left instead of a scroll. Nothing sits in the old portrait slot yet.
 */
export default function HomePage() {
  return (
    <>
      <ThemeStyle theme={HOME_THEME} />

      <HomeSideNav />

      <div className="md:pl-72 lg:pl-80">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-8 md:px-10 md:pb-20">
          <main id="content">
            <Hero />
          </main>

          <footer className="mt-16 border-t border-line pt-8">
            <HomeFooterNote />
          </footer>
        </div>
      </div>
    </>
  );
}
