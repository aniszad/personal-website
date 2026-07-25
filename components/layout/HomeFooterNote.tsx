"use client";

import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function HomeFooterNote() {
  const { language } = useLanguage();
  return <p className="text-sm text-muted">{t(language).home.footerBuiltWith}</p>;
}
