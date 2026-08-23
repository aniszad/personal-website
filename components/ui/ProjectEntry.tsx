import Link from "next/link";
import type { ResolvedProject } from "@/lib/data";
import { TagList } from "@/components/ui/TagList";
import { ScreenshotGallery } from "@/components/ui/ScreenshotGallery";
import { ExternalLinkIcon, GitHubIcon } from "@/components/ui/Icons";
import { localizeContent, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

/**
 * One project, set as a hairline separated row rather than a card.
 *
 * Every title is the same size. Importance is carried by order and by a small
 * accent eyebrow over the featured few, not by a jump in type scale, because
 * three different heading sizes down one column read as an accident rather than
 * a hierarchy.
 *
 * When a writeup exists the title links to it and a spanning pseudo element
 * makes the whole row clickable. The repository and demo icons, and the media,
 * sit above that overlay so they stay independently reachable.
 */
export function ProjectEntry({ project }: { project: ResolvedProject }) {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const hasWriteup = Boolean(project.writeup);
  const { screenshots, demoVideo } = project;

  /*
    The still and the clip sit side by side rather than one replacing the other:
    the screenshot shows the product at rest, the video tile beside it plays the
    demonstration on click. The first screenshot doubles as the clip's poster so
    the two read as a matched pair.
  */
  const poster = demoVideo ? (screenshots[0] ?? null) : null;
  const hasMedia = Boolean(demoVideo) || screenshots.length > 0;

  return (
    <article className="retro-record group relative py-12 md:py-16">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="retro-record-id mb-4">
            PROJECT // {project.slug.toUpperCase()}
          </p>
          {project.featured ? (
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {copy.featured}
            </p>
          ) : null}

          <h3 className="text-3xl text-heading transition-colors duration-300 group-hover:text-accent md:text-4xl">
            {hasWriteup ? (
              <Link
                href={`/projects/${project.slug}`}
                className="before:absolute before:inset-0"
              >
                {project.name}
              </Link>
            ) : (
              project.name
            )}
          </h3>
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-5 pt-1">
          {project.proprietary ? (
            <span className="hidden text-sm text-muted sm:inline">
              {copy.proprietarySource}
            </span>
          ) : null}

          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted transition-colors duration-200 hover:text-accent"
            >
              <GitHubIcon width={20} height={20} />
              <span className="sr-only">
                {project.name} {copy.sourceOnGithub}
              </span>
            </a>
          ) : null}

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted transition-colors duration-200 hover:text-accent"
            >
              <ExternalLinkIcon width={20} height={20} />
              <span className="sr-only">
                {project.name} {copy.liveDemo}
              </span>
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {localizeContent(language, project.description)}
      </p>

      <TagList
        labels={project.tags}
        className="mt-6"
        ariaLabel={`${copy.technologiesUsedIn} ${project.name}`}
      />

      {hasMedia ? (
        <ScreenshotGallery
          projectName={project.name}
          screenshots={screenshots}
          demoVideo={demoVideo}
          demoPoster={poster}
        />
      ) : null}
    </article>
  );
}
