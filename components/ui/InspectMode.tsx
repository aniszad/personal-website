"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CloseIcon } from "@/components/ui/Icons";

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
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<Inspectable | null>(null);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const toggle = () => {
      setActive((value) => !value);
      setSelected(null);
      setBounds(null);
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
        cursor.current?.style.setProperty("transform", `translate3d(${point.current.x}px, ${point.current.y}px, 0)`);
        frame.current = 0;
      });
    };
    const click = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-inspect]");
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      const source = SOURCES[element.dataset.inspect ?? ""];
      if (source) {
        setSelected(source);
        setBounds(element.getBoundingClientRect());
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
        setSelected(null);
        setBounds(null);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("click", click, true);
    window.addEventListener("keydown", escape);
    return () => {
      document.body.classList.remove("inspect-mode-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click, true);
      window.removeEventListener("keydown", escape);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [active]);

  return (
    <>
      {active ? (
        <>
          <div ref={cursor} aria-hidden="true" className="inspect-cursor" />
          <div className="fixed left-1/2 top-5 z-[90] -translate-x-1/2 border border-accent/40 bg-surface-raised/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
            Inspect mode · click a surface · Esc to exit
          </div>
        </>
      ) : null}
      {bounds && selected ? (
        <div aria-hidden="true" className="pointer-events-none fixed z-[89] border border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.12)]"
          style={{ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }} />
      ) : null}
      <AnimatePresence>
        {selected ? (
          <motion.aside role="dialog" aria-label={`Source for ${selected.name}`}
            className="fixed bottom-5 right-5 z-[91] w-[min(92vw,34rem)] max-w-full overflow-hidden border border-line bg-surface-raised shadow-2xl"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 12 }}>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div><p className="font-display text-sm font-semibold text-heading">{selected.name}</p><p className="mt-0.5 font-mono text-[10px] text-accent">{selected.file}</p></div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close source preview" className="text-muted hover:text-heading"><CloseIcon width={18} height={18} /></button>
            </div>
            <pre className="max-h-64 overflow-auto p-4 text-xs leading-relaxed text-body"><code>{selected.source}</code></pre>
            <div className="border-t border-line px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-muted">Actual source excerpt</div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
