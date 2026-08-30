"use client";

import type { ResolvedExperience } from "@/lib/data";
import { LogoPlate } from "@/components/ui/LogoPlate";
import { TagList } from "@/components/ui/TagList";
import { localizeContent, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

/** One role in the experience ledger: dates in the left column, everything else in the right. */
export function ExperienceEntry({
  entry,
  current,
}: {
  entry: ResolvedExperience;
  current: boolean;
}) {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const translate = (value: string) => localizeContent(language, value);

  return (
    <div className="grid grid-cols-1 gap-2 border-b border-line-soft py-9 md:grid-cols-[190px_minmax(0,1fr)] md:gap-12">
      <div>
        <p
          className={`text-[13px] font-light leading-[1.5] ${current ? "text-body-strong" : "text-muted"}`}
        >
          {translate(entry.dates)}
        </p>
        {current ? (
          <p className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-heading">
            {copy.currentRole}
          </p>
        ) : null}
      </div>

      <article>
        <h2 className="font-serif text-[30px] leading-[1.1] text-heading">
          {translate(entry.role)}
        </h2>

        <div className="mt-3 flex items-center gap-2.5">
          {entry.logo ? (
            <LogoPlate src={entry.logo} name={entry.company} size="md" />
          ) : null}

          <p className="text-sm text-body-strong">
            {entry.company}
            {entry.location ? <span className="text-muted">, {translate(entry.location)}</span> : null}
          </p>
        </div>

        <ul className="mt-5 flex max-w-[760px] flex-col gap-3">
          {entry.highlights.map((highlight) => (
            <li
              key={highlight}
              className="border-l border-line pl-4 text-[15px] font-light leading-[1.65] text-body"
            >
              {translate(highlight)}
            </li>
          ))}
        </ul>

        <TagList
          labels={entry.tags}
          ariaLabel={`${copy.technologiesUsedAt} ${entry.company}`}
        />
      </article>
    </div>
  );
}
