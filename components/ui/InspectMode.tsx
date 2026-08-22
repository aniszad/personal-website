"use client";

import { useEffect, useRef, useState } from "react";

type Inspectable = { name: string; file: string; source: string };

const SOURCES: Record<string, Inspectable> = {
  hero: {
    name: "Hero",
    file: "components/sections/Hero.tsx",
    source: `const spotlightBackground = useMotionTemplate\`
  radial-gradient(
    600px circle at \${mouseX}px \${mouseY}px,
    rgba(183, 243, 74, 0.04),
    transparent 80%
  )\`;`,
  },
  homeNav: {
    name: "HomeSideNav",
    file: "components/layout/HomeSideNav.tsx",
    source: `<PaletteTrigger className="mt-8 w-full" />\n<NavList pages={pages} label={copy.home.indexLabel} />`,
  },
  siteNav: {
    name: "SiteNav",
    file: "components/layout/SiteNav.tsx",
    source: `<nav aria-label={copy.generic.siteSections}>\n  <Link href="/">{SITE.name}</Link>\n  <ul>{pages.map((page) => ...)}</ul>\n</nav>`,
  },
  pageContent: {
    name: "PageShell",
    file: "components/layout/PageShell.tsx",
    source: `<ThemeStyle theme={page.theme} />\n<SiteNav />\n<PageHeading title={localizedPage.title} />\n<main id="content">{children}</main>`,
  },
};

function toggleInspectMode() {
  window.dispatchEvent(new CustomEvent("portfolio:toggle-inspect"));
}

export function InspectTrigger({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={toggleInspectMode} aria-label="Inspect interface"
      className={`group inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent ${className}`}>
      <span className="size-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
      Inspect
    </button>
  );
}

export function InspectMode() {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<Inspectable | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const toggle = () => {
      setActive((value) => !value);
      setHovered(null);
    };
    window.addEventListener("portfolio:toggle-inspect", toggle);
    return () => window.removeEventListener("portfolio:toggle-inspect", toggle);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.body.classList.add("inspect-mode-active");

    const move = (event: MouseEvent) => {
      point.current = { x: event.clientX, y: event.clientY };
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        const { x, y } = point.current;
        cursor.current?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`);
        const mask = `radial-gradient(circle 150px at ${x}px ${y}px, black 0%, black 58%, transparent 100%)`;
        reveal.current?.style.setProperty("mask-image", mask);
        reveal.current?.style.setProperty("-webkit-mask-image", mask);

        const element = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-inspect]");
        const source = element ? SOURCES[element.dataset.inspect ?? ""] : undefined;
        // The entire page remains inspectable. Untagged whitespace and
        // structural areas fall back to the page composition source instead
        // of leaving an empty reveal circle.
        setHovered(source ?? SOURCES.pageContent);
        frame.current = 0;
      });
    };

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
        setHovered(null);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("keydown", escape);
    return () => {
      document.body.classList.remove("inspect-mode-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("keydown", escape);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [active]);

  return active ? (
    <>
      <div ref={cursor} aria-hidden="true" className="inspect-cursor" />
          <div ref={reveal} aria-hidden="true" style={{ maskImage: "radial-gradient(circle 150px at 0 0, black 0%, black 58%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle 150px at 0 0, black 0%, black 58%, transparent 100%)" }} className="pointer-events-none fixed inset-0 z-[88] overflow-hidden bg-[#080908]/95 text-[#b7f34a] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]">
            {hovered ? (
              <div className="absolute inset-0 overflow-hidden p-8 font-mono text-xs leading-relaxed opacity-90">
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#b7f34a]/70">{hovered.name} · {hovered.file}</p>
                <pre className="whitespace-pre-wrap">{hovered.source}</pre>
              </div>
            ) : null}
      </div>
      <div className="fixed left-1/2 top-5 z-[90] -translate-x-1/2 border border-accent/40 bg-surface-raised/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
        Inspect mode · move over a surface · Esc to exit
      </div>
    </>
  ) : null;
}
