"use client";

import Image from "next/image";
import { CV_PATH } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/**
 * About page body: prose column with a CV link, and a portrait plate with a
 * short set of definition rows beside it.
 */
export function About() {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const [lead, ...rest] = copy.aboutParagraphs;
  const meta = copy.aboutMeta;

  return (
    <FadeInOnScroll className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14">
      <div className="flex max-w-[620px] flex-col gap-[22px]">
        <p className="text-[17px] font-light leading-[1.72] text-body-strong text-pretty">
          {lead}
        </p>

        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-[17px] font-light leading-[1.72] text-body text-pretty">
            {paragraph}
          </p>
        ))}

        <a
          href={CV_PATH}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 self-start border-b border-heading pb-[5px] text-[14.5px] font-medium text-heading"
        >
          {meta.downloadCv}
        </a>
      </div>

      <div>
        <Image
          src="/images/anis.webp"
          alt="Anis Zadri"
          width={300}
          height={375}
          className="block aspect-[4/5] w-full border border-line object-cover"
          priority
        />

        <dl className="mt-[14px] grid gap-2.5">
          <DefinitionRow label={meta.basedInLabel} value={meta.basedInValue} border />
          <DefinitionRow label={meta.languagesLabel} value={meta.languagesValue} border />
          <DefinitionRow label={meta.lookingForLabel} value={meta.lookingForValue} />
        </dl>
      </div>
    </FadeInOnScroll>
  );
}

function DefinitionRow({
  label,
  value,
  border = false,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-[12.5px] font-light text-muted ${
        border ? "border-b border-line-soft pb-2" : ""
      }`}
    >
      <dt>{label}</dt>
      <dd className="text-body-strong">{value}</dd>
    </div>
  );
}
