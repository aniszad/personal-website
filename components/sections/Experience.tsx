import type { ResolvedExperience } from "@/lib/data";
import { ExperienceEntry } from "@/components/ui/ExperienceEntry";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/** Experience page body: a ledger, one row per role, most recent first. */
export function Experience({
  entries,
}: {
  entries: readonly ResolvedExperience[];
}) {
  return (
    <FadeInOnScroll>
      {entries.map((entry, index) => (
        <ExperienceEntry
          key={`${entry.company}-${entry.role}`}
          entry={entry}
          current={index === 0}
        />
      ))}
    </FadeInOnScroll>
  );
}
