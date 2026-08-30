import { cn } from "@/lib/utils";

/** Technology tags, set as bordered chips: hairline border, 2px radius. */
export function TagList({
  labels,
  className,
  ariaLabel,
}: {
  labels: readonly string[];
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <ul
      className={cn("mt-4 flex flex-wrap items-center gap-[7px]", className)}
      aria-label={ariaLabel}
    >
      {labels.map((label) => (
        <li
          key={label}
          className="rounded-sm border border-line px-[9px] py-1.5 text-[11.5px] font-light text-muted"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
