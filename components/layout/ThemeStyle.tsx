import type { Theme } from "@/lib/constants";

/**
 * Applies a page's colour identity to the whole document.
 *
 * Tailwind emits the `@theme` tokens inside `@layer theme`, and unlayered rules
 * beat layered ones no matter what order they appear in, so this plain style
 * element overrides them without needing a more specific selector or an
 * important. Every utility in the tree already reads these variables, which is
 * why nothing else has to know a theme exists.
 *
 * It renders on the server, so the correct colours are in the exported HTML and
 * a hard refresh paints them on the first frame rather than flashing the
 * default navy. On a client navigation React swaps this element and the
 * variables change under `body`, whose background transition turns that into a
 * crossfade rather than a cut.
 *
 * `dangerouslySetInnerHTML` is here because React escapes text children, which
 * would corrupt any CSS containing an ampersand or an angle bracket. The values
 * are hex literals from a typed constant in this repository, never user input.
 */
export function ThemeStyle({ theme }: { theme: Theme }) {
  const css = `:root{--color-accent:${theme.accent};--color-surface:${theme.surface};--color-surface-raised:${theme.raised};--color-line:${theme.line};}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
