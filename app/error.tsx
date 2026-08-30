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
      <p className="font-serif text-6xl text-heading">500</p>
      <h1 className="mt-4 font-serif text-2xl text-heading">
        {copy.heading}
      </h1>
      <p className="mt-4 max-w-md font-light text-muted">
        {copy.body}
      </p>
      <div className="mt-8 flex gap-8">
        <button
          onClick={reset}
          className="border-b border-heading pb-1 text-sm font-medium text-heading"
        >
          {copy.retry}
        </button>
        <a
          href="/"
          className="border-b border-line-strong pb-1 text-sm text-muted transition-colors duration-200 hover:text-heading"
        >
          {copy.home}
        </a>
      </div>
    </div>
  );
}
