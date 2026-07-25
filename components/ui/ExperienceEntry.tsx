import type { ResolvedExperience } from "@/lib/data";
import { LogoPlate } from "@/components/ui/LogoPlate";
import { TagList } from "@/components/ui/TagList";

/**
 * One role in the experience list.
 *
 * The date sits above the role as a small caption rather than in its own
 * column, which lets the role title start at the left margin and keeps the
 * scan line of titles unbroken all the way down the page.
 */
export function ExperienceEntry({ entry }: { entry: ResolvedExperience }) {
  return (
    <article>
      <p className="text-sm text-muted">{entry.dates}</p>

      <h3 className="mt-2 text-3xl text-heading md:text-4xl">
        {entry.role}
      </h3>

      <div className="mt-3 flex items-center gap-4">
        {entry.logo ? (
          <LogoPlate src={entry.logo} name={entry.company} size="sm" />
        ) : null}

        <p className="text-base text-body">
          {entry.company}
          <span className="text-muted">, {entry.location}</span>
        </p>
      </div>

      <ul className="mt-6 space-y-3 border-l border-line pl-5">
        {entry.highlights.map((highlight) => (
          <li key={highlight} className="text-base leading-relaxed text-muted">
            {highlight}
          </li>
        ))}
      </ul>

      <TagList
        labels={entry.tags}
        className="mt-6"
        ariaLabel={`Technologies used at ${entry.company}`}
      />
    </article>
  );
}
