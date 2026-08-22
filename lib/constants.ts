export const SITE = {
  name: "Anis Zadri",
  title: "AI and Software Engineering Student",
  /**
   * The second line of the masthead. Names both fields as one thing, because
   * the studying and the building happen across both rather than split between
   * them, and claims neither job title outright.
   */
  discipline: "Training and working in AI and software engineering.",
  tagline:
    "An engineering cycle in AI and Data Science at ESTIN, a stage spent shipping production code at Limpidius, and a Master's in Artificial Intelligence at Université de Lille from this September.",
  location: "Lille, France",
  availability: "Open for alternance, September 2026",
  url: "https://aniszadri.dev",
  locale: "en",
  description:
    "Anis Zadri, Master's student in Artificial Intelligence at Université de Lille. Training and working in AI and software engineering, and open for an alternance from September 2026.",
} as const;

export const SOCIALS = {
  github: "https://github.com/aniszad",
  linkedin: "https://www.linkedin.com/in/anis-zadri-735905267",
  email: "anis.zadri8@gmail.com",
} as const;

/** Downloadable CV, resolved against /public. */
export const CV_PATH = "/cv_ia_Anis_ZADRI.pdf";

/**
 * A page's colour identity.
 *
 * The site uses a near-black editorial palette. Pages vary only slightly in
 * surface tone, while one warm brass accent carries links, rules, and markers
 * throughout the system. Keeping the palette restrained makes typography,
 * spacing, and project evidence do the visual work.
 *
 * Text tokens are deliberately absent. Muted, body, and heading hold still on
 * every page, which is what keeps the contrast ratios fixed and means a theme
 * can never be added that quietly fails to be readable.
 */
export type Theme = {
  /** Links, rules, markers, timeline fill, and the ambient wash. */
  accent: string;
  /** Page background. */
  surface: string;
  /** Panels sitting above the background. */
  raised: string;
  /** Hairline rules and borders. */
  line: string;
};

export type PageMeta = {
  /** Route path, including the leading slash. */
  href: string;
  /** Short form used in navigation. */
  label: string;
  /** Page heading. */
  title: string;
  /** One line summary, shown on the index and under the page heading. */
  blurb: string;
  /** Colour identity, applied as custom properties for the whole document. */
  theme: Theme;
};

/**
 * The index establishes the canonical palette. Other pages keep the same
 * accent and introduce only near-black surface variations, so navigation feels
 * like one considered publication rather than a set of themed screens.
 */
export const HOME_THEME: Theme = {
  accent: "#d6b27c",
  surface: "#0b0b0a",
  raised: "#141412",
  line: "#2b2a26",
};

/**
 * The site is a sequence rather than a menu. This array is the single source of
 * order: the index listing, the top bar, the previous and next links at the
 * foot of each page, and each page's metadata all read from it.
 *
 * The surfaces shift by only a few values of lightness. The accent does not
 * change between routes: restraint is part of the visual identity.
 */
export const PAGES: readonly PageMeta[] = [
  {
    href: "/about",
    label: "About",
    title: "About",
    blurb:
      "Engineering student, production developer, and the path between the two.",
    theme: {
      accent: "#d6b27c",
      surface: "#0d0d0c",
      raised: "#161614",
      line: "#2e2d28",
    },
  },
  {
    href: "/experience",
    label: "Experience",
    title: "Experience",
    blurb:
      "Three roles, from a bus fleet system in Béjaïa to a scanner running in French retail.",
    theme: {
      accent: "#d6b27c",
      surface: "#0a0a09",
      raised: "#131311",
      line: "#292824",
    },
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Projects",
    blurb:
      "From a scanner running in French retail to a deep learning timetable planner.",
    theme: {
      accent: "#d6b27c",
      surface: "#0c0c0b",
      raised: "#151513",
      line: "#2c2b27",
    },
  },
  {
    href: "/education",
    label: "Education",
    title: "Education",
    blurb:
      "From ESTIN in Algeria to a Master's in Artificial Intelligence at Université de Lille.",
    theme: {
      accent: "#d6b27c",
      surface: "#0e0e0c",
      raised: "#171714",
      line: "#302f29",
    },
  },
  {
    href: "/skills",
    label: "Skills",
    title: "Skills",
    blurb:
      "The languages, frameworks, and infrastructure I actually reach for.",
    theme: {
      accent: "#d6b27c",
      surface: "#0b0b0a",
      raised: "#141412",
      line: "#2b2a26",
    },
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Get in Touch",
    blurb:
      "Looking for an alternance from September 2026, in and around Lille.",
    theme: HOME_THEME,
  },
] as const;

/** Looks up a page by route, for building headers without repeating copy. */
export function getPage(href: string): PageMeta {
  const page = PAGES.find((candidate) => candidate.href === href);
  if (!page) {
    throw new Error(`No page metadata registered for route ${href}`);
  }
  return page;
}

/**
 * Neighbours in reading order, used by the footer navigation. Returns null at
 * each end of the sequence so the first and last pages render a single link.
 */
export function getNeighbours(href: string): {
  previous: PageMeta | null;
  next: PageMeta | null;
} {
  const position = PAGES.findIndex((candidate) => candidate.href === href);
  return {
    previous: position > 0 ? PAGES[position - 1] : null,
    next: position < PAGES.length - 1 ? PAGES[position + 1] : null,
  };
}
