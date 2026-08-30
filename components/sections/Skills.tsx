"use client";

import { SKILL_GROUPS } from "@/lib/data";
import { localizeSkillCategory } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/** Skills page body: a plain reference table, one row per category. No proficiency bars. */
export function Skills() {
  const { language } = useLanguage();

  return (
    <FadeInOnScroll>
      {SKILL_GROUPS.map((group) => (
        <div
          key={group.category}
          className="grid grid-cols-1 items-baseline gap-2 border-b border-line-soft py-[26px] md:grid-cols-[220px_minmax(0,1fr)] md:gap-11"
        >
          <h2 className="font-serif text-xl leading-[1.2] text-heading">
            {localizeSkillCategory(language, group.category)}
          </h2>
          <p className="text-[15px] font-light leading-[1.7] text-body-strong">
            {group.skills.join(" · ")}
          </p>
        </div>
      ))}
    </FadeInOnScroll>
  );
}
