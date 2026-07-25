import { resolveImage, resolveVideo } from "@/lib/assets";
import {
  EDUCATION,
  EXPERIENCES,
  PROJECTS,
  type ResolvedEducationEntry,
  type ResolvedExperience,
  type ResolvedProject,
} from "@/lib/data";

/**
 * Turns the declarative content in lib/data.ts into content whose images are
 * known to exist. Call these from server components only; they touch the file
 * system and run at build time.
 */

/** How many screenshots a single project may contribute, by convention. */
const MAX_SCREENSHOTS = 3;

/**
 * Screenshots follow a naming convention rather than being listed by hand:
 * /public/images/projects/{slug}-1, -2, -3 in any supported format. Whichever
 * exist are attached, in order.
 */
export function resolveProjects(): readonly ResolvedProject[] {
  return PROJECTS.map((project) => {
    const screenshots: string[] = [];

    for (let position = 1; position <= MAX_SCREENSHOTS; position += 1) {
      const found = resolveImage(
        `/images/projects/${project.slug}-${position}`,
      );
      if (found) screenshots.push(found);
    }

    const demoVideo = resolveVideo(`/images/projects/${project.slug}-demo`);

    return { ...project, screenshots, demoVideo };
  });
}

/** Attaches each institution's logo when a matching file is on disk. */
export function resolveEducation(): readonly ResolvedEducationEntry[] {
  return EDUCATION.map((entry) => ({
    ...entry,
    logo: entry.logo ? resolveImage(entry.logo) : null,
  }));
}

/** Attaches each company's logo when a matching file is on disk. */
export function resolveExperiences(): readonly ResolvedExperience[] {
  return EXPERIENCES.map((entry) => ({
    ...entry,
    logo: entry.logo ? resolveImage(entry.logo) : null,
  }));
}
