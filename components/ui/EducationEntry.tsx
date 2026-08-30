"use client";

import type { ResolvedEducationEntry } from "@/lib/data";
import { LogoPlate } from "@/components/ui/LogoPlate";
import { localizeContent, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

function displayDomain(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** One row in the education list: dates, degree with institution, and a website link. */
export function EducationEntry({
  entry,
  starting,
}: {
  entry: ResolvedEducationEntry;
  starting: boolean;
}) {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const translate = (value: string) => localizeContent(language, value);

  return (
    <div className="grid grid-cols-1 items-baseline gap-3 border-b border-line-soft py-8 md:grid-cols-[160px_minmax(0,1fr)_150px] md:gap-11">
      <div>
        <p className={`text-[13px] font-light ${starting ? "text-body-strong" : "text-muted"}`}>
          {translate(entry.dates)}
        </p>
        {starting ? (
          <p className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-heading">
            {copy.startingSoon}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="font-serif text-[26px] leading-[1.15] text-heading">
          {translate(entry.degree)}
        </h2>

        <div className="mt-3 flex items-center gap-2.5">
          {entry.logo ? <LogoPlate src={entry.logo} name={entry.institution} size="sm" /> : null}
          <p className="text-[13.5px] text-body-strong">
            {entry.institution}
            <span className="text-muted">, {translate(entry.location)}</span>
          </p>
        </div>

        <p className="mt-3 max-w-[660px] text-[14.5px] font-light leading-[1.65] text-body">
          {translate(entry.description)}
        </p>
      </div>

      {entry.website ? (
        <a
          href={entry.website}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[12px] font-light text-muted transition-colors duration-200 hover:text-heading md:text-right"
        >
          {displayDomain(entry.website)} ↗
        </a>
      ) : null}
    </div>
  );
}
