"use client";

import { useEffect } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const copy = t(language).generic.error;
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-accent">500</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-heading">
        {copy.heading}
      </h1>
      <p className="mt-4 max-w-md text-muted">
        {copy.body}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-surface"
        >
          {copy.retry}
        </button>
        <a
          href="/"
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:border-accent/50 hover:text-heading"
        >
          {copy.home}
        </a>
      </div>
    </div>
  );
}
