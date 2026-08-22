"use client";

import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { SearchIcon } from "@/components/ui/Icons";

function open() {
  window.dispatchEvent(new CustomEvent("portfolio:toggle-palette"));
}

/**
 * Visible entry point into the command palette. The keyboard shortcut alone
 * would leave touch users with no way to find it, so this goes wherever the
 * palette should be discoverable.
 */
export function PaletteTrigger({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { language } = useLanguage();
  const label = t(language).generic.commandPalette.trigger;

  return (
    <button
      type="button"
      onClick={() => {
        open();
        onClick?.();
      }}
      className={`group flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent/40 hover:text-heading ${className}`}
    >
      <SearchIcon width={15} height={15} />
      <span className="flex-1 text-left">{label}</span>
      <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[10px] text-muted transition-colors duration-200 group-hover:text-heading">
        ⌘K
      </kbd>
    </button>
  );
}

/** Icon-only variant for tight spaces, like the mobile top bar. */
export function PaletteTriggerIcon({ className = "" }: { className?: string }) {
  const { language } = useLanguage();
  const label = t(language).generic.commandPalette.trigger;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={label}
      className={`text-muted transition-colors duration-200 hover:text-heading ${className}`}
    >
      <SearchIcon width={20} height={20} />
    </button>
  );
}
