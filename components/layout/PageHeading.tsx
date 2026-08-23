"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/components/layout/LanguageProvider";

/**
 * The heading block at the top of every section page.
 *
 * The title rises out of a clipped box and the rule beneath it draws left to
 * right in the page accent, so the first thing that moves on arrival is also
 * the first thing that states which colour this section is. It replaces a
 * static border, which is why the rule is a real element rather than a
 * border-bottom.
 */
export function PageHeading({
  title,
  blurb,
  moduleName,
}: {
  title: string;
  blurb: string;
  moduleName?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <header className="retro-module-header relative mb-20 pb-10 md:mb-28">
      <div className="retro-module-bar" aria-hidden="true">
        <span>MODULE // {moduleName ?? title}</span>
        <span className="hidden sm:inline">{isFrench ? "LECTURE_SEULE · SYS.PRTF" : "READ_ONLY · SYS.PRTF"}</span>
      </div>
      <h1 className="text-5xl text-heading md:text-7xl">
        <span className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: "120%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            transition={{
              duration: reduced ? 0.3 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {title}
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduced ? 0.2 : 0.55,
          ease: "easeOut",
          delay: reduced ? 0 : 0.18,
        }}
      >
        {blurb}
      </motion.p>

      <div className="retro-module-footer" aria-hidden="true">
        <span>{isFrench ? "PRÊT" : "READY"}</span>
        <span>{isFrench ? "DÉFILER POUR INSPECTER" : "SCROLL TO INSPECT"}</span>
      </div>
    </header>
  );
}
