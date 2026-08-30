import type { Metadata, Viewport } from "next";
import { HOME_THEME, getPage } from "@/lib/constants";
import { resolveProjects } from "@/lib/resolve";
import { PageShell } from "@/components/layout/PageShell";
import { Projects } from "@/components/sections/Projects";

const page = getPage("/projects");

export const metadata: Metadata = {
  title: page.title,
  description: page.blurb,
  alternates: { canonical: page.href },
};

export const viewport: Viewport = {
  themeColor: HOME_THEME.surface,
  colorScheme: "dark",
};

export default function ProjectsPage() {
  // Screenshots are matched against /public at build time by naming convention,
  // so a project with no images renders as text only.
  const projects = resolveProjects();

  return (
    <PageShell page={page}>
      <Projects projects={projects} />
    </PageShell>
  );
}
