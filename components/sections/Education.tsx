import type { ResolvedEducationEntry } from "@/lib/data";
import { EducationEntry } from "@/components/ui/EducationEntry";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/** Education page body: a single spine, one row per entry, oldest first. */
export function Education({
  entries,
}: {
  entries: readonly ResolvedEducationEntry[];
}) {
  return (
    <FadeInOnScroll>
      {entries.map((entry, index) => (
        <EducationEntry
          key={`${entry.institution}-${entry.dates}`}
          entry={entry}
          starting={index === entries.length - 1}
        />
      ))}
    </FadeInOnScroll>
  );
}
