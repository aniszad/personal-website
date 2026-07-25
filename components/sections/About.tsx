"use client";

import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { RevealText } from "@/components/animations/RevealText";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/**
 * About page body.
 *
 * Visual identity: a static dot grid behind the opening paragraph, and text
 * that assembles word by word as it enters view. The reveal is the whole
 * treatment here, so nothing else on the page competes with it.
 */
export function About() {
  const { language } = useLanguage();
  const aboutParagraphs = t(language).generic.aboutParagraphs;
  const [lead, ...rest] = aboutParagraphs;

  return (
    <div className="relative">
      {/*
        Dot grid, masked so it fades out before it reaches the text. Purely
        decorative and kept out of the accessibility tree.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-24 hidden size-72 opacity-40 md:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(circle at 30% 30%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 30% 30%, black, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl space-y-8">
        <RevealText
          text={lead}
          className="text-xl leading-relaxed text-body md:text-2xl"
        />

        {rest.map((paragraph, position) => (
          <FadeInOnScroll
            key={paragraph.slice(0, 40)}
            delay={position * 0.05}
          >
            <p className="text-base leading-relaxed text-muted md:text-lg">
              {paragraph}
            </p>
          </FadeInOnScroll>
        ))}
      </div>
    </div>
  );
}
