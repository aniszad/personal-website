import { SOCIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";

const links = [
  { href: SOCIALS.github, label: "GitHub", Icon: GitHubIcon },
  { href: SOCIALS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: `mailto:${SOCIALS.email}`, label: "Email", Icon: MailIcon },
] as const;

export function SocialLinks({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <ul className={cn("flex items-center gap-5", className)}>
      {links.map(({ href, label, Icon }) => {
        const isExternal = href.startsWith("http");
        return (
          <li key={label}>
            <a
              href={href}
              className="block text-muted transition-colors duration-200 hover:text-accent"
              {...(isExternal
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
            >
              <Icon width={size} height={size} />
              <span className="sr-only">
                {label}
                {isExternal ? " (opens in a new tab)" : ""}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
