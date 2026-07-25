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
 * The navy is the site, so it never leaves: every surface here sits between 10
 * and 13 percent lightness in the 200 to 240 degree range, and the shift
 * between them is small enough that no page looks like a different website.
 * What actually carries the section is the accent, which the ambient wash then
 * spreads across the whole background.
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
 * The index keeps the canonical palette, so the accent a visitor meets first is
 * the one the site is built on. Every section then departs from it and Contact
 * returns, which closes the sequence where it opened.
 */
export const HOME_THEME: Theme = {
  accent: "#64ffda",
  surface: "#0a192f",
  raised: "#112240",
  line: "#233554",
};

/**
 * The site is a sequence rather than a menu. This array is the single source of
 * order: the index listing, the top bar, the previous and next links at the
 * foot of each page, and each page's metadata all read from it.
 *
 * The accents walk once around the wheel in reading order, teal to cyan to
 * periwinkle to amber to violet to green and back to teal. Moving in one
 * direction is what makes the colour read as a journey rather than as six
 * unrelated decisions.
 */
export const PAGES: readonly PageMeta[] = [
  {
    href: "/about",
    label: "About",
    title: "About",
    blurb:
      "Engineering student, production developer, and the path between the two.",
    theme: {
      accent: "#7fe9ff",
      surface: "#07182a",
      raised: "#0f2138",
      line: "#1f3b56",
    },
  },
  {
    href: "/experience",
    label: "Experience",
    title: "Experience",
    blurb:
      "Three roles, from a bus fleet system in Béjaïa to a scanner running in French retail.",
    theme: {
      accent: "#8fb4ff",
      surface: "#0a1730",
      raised: "#131f3f",
      line: "#25365c",
    },
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Projects",
    blurb:
      "From a scanner running in French retail to a deep learning timetable planner.",
    theme: {
      accent: "#ffb877",
      surface: "#0c1526",
      raised: "#151e34",
      line: "#2c3450",
    },
  },
  {
    href: "/education",
    label: "Education",
    title: "Education",
    blurb:
      "From ESTIN in Algeria to a Master's in Artificial Intelligence at Université de Lille.",
    theme: {
      accent: "#c0a4ff",
      surface: "#0b1533",
      raised: "#141e42",
      line: "#293361",
    },
  },
  {
    href: "/skills",
    label: "Skills",
    title: "Skills",
    blurb:
      "The languages, frameworks, and infrastructure I actually reach for.",
    theme: {
      accent: "#78ecb4",
      surface: "#08192b",
      raised: "#10233a",
      line: "#1e3b52",
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
