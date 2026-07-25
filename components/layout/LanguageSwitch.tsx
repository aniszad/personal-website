"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface-raised/80 p-1",
        compact ? "scale-95" : "",
      )}
      role="group"
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
          language === "en"
            ? "bg-accent text-surface"
            : "text-muted hover:text-heading",
        )}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
          language === "fr"
            ? "bg-accent text-surface"
            : "text-muted hover:text-heading",
        )}
        aria-pressed={language === "fr"}
      >
        FR
      </button>
    </div>
  );
}
