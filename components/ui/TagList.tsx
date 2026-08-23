import { cn } from "@/lib/utils";

/**
 * Technology tags, set as a plain inline run separated by hairline slashes
 * rather than as pills.
 *
 * Pills read as component library chrome and pull far more attention than a
 * list of tool names deserves. This keeps the same information at the weight of
 * a caption.
 */
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
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      aria-label={ariaLabel}
    >
      {labels.map((label, position) => (
        <li key={label} className="flex items-center gap-3 font-mono text-xs text-muted">
          {label}
          {position < labels.length - 1 ? (
            <span aria-hidden="true" className="text-line">
              /
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
