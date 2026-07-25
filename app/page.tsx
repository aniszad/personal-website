import type { Viewport } from "next";
import { resolveImage, resolveVideo } from "@/lib/assets";
import { HOME_THEME, SITE } from "@/lib/constants";
import { ThemeStyle } from "@/components/layout/ThemeStyle";
import { Hero } from "@/components/sections/Hero";
import { IndexNav } from "@/components/layout/IndexNav";
import { Portrait } from "@/components/ui/Portrait";
import { PortraitMotion } from "@/components/ui/PortraitMotion";
import { SocialLinks } from "@/components/ui/SocialLinks";

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
  /*
    Both are optional and both are matched against /public at build time. With
    the loop present the portrait animates; with only a still it holds; with
    neither the masthead simply lays out full width. Nothing here 404s.
  */
  const portrait = resolveImage("/images/anis");
  const loop = resolveVideo("/media/anis");

  const alt = `Illustrated portrait of ${SITE.name}, arms folded, drawn in front of a grand hotel facade in ${SITE.location}`;

  const plate = loop ? (
    <PortraitMotion video={loop} poster={portrait} alt={alt} />
  ) : portrait ? (
    <Portrait src={portrait} alt={alt} />
  ) : null;

  return (
    <>
      <ThemeStyle theme={HOME_THEME} />

      <div className="mx-auto max-w-5xl px-6 pb-14 pt-8 md:px-10 md:pb-20">
        <main id="content">
          <Hero portrait={plate} />

          <div className="pt-16 md:pt-24">
            <IndexNav />
          </div>
        </main>

        <footer className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SocialLinks />
          <p className="text-sm text-muted">
            Built with Next.js and Tailwind CSS.
          </p>
        </footer>
      </div>
    </>
  );
}
