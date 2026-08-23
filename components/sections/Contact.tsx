"use client";

import { useState, FormEvent } from "react";
import { CV_PATH, SOCIALS } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

/**
 * Contact page body.
 *
 * Visual identity: a quiet full-bleed accent wash that belongs to the page,
 * rather than a pointer glow trapped inside a panel. The global ambient layer
 * and this local tonal field now blend without creating a visible card edge.
 */
type FormStatus = "idle" | "sending" | "success" | "error";

export function Contact() {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const formCopy = copy.contactForm;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? formCopy.errorFallback);
      }
      setFormStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : formCopy.errorFallback);
      setFormStatus("error");
    }
  }

  return (
    <div className="retro-terminal relative isolate py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-12 -inset-y-16 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 82% 48%, color-mix(in srgb, var(--color-accent) 7%, transparent), transparent 56%)",
        }}
      />

      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line" />

      <div className="relative max-w-3xl">
        <p className="retro-terminal-prompt mb-4">INPUT // CONNECTION REQUEST</p>

        <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-heading md:text-4xl">
          {copy.contactLead}
        </p>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          {copy.contactBody}
        </p>

        <a
          href={`mailto:${SOCIALS.email}`}
          className="group mt-14 inline-block"
        >
          <span className="block break-all font-display text-3xl font-semibold tracking-tight text-accent transition-opacity duration-300 group-hover:opacity-70 md:text-5xl">
            {SOCIALS.email}
          </span>
          {/*
            The rule is always drawn on touch, where there is no hover to
            reveal it. Both the resting and hover states are scoped to the same
            breakpoint, otherwise the responsive variant would be emitted after
            the hover variant and win even while hovered.
          */}
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-full origin-left bg-accent transition-transform duration-500 ease-out motion-reduce:transition-none md:scale-x-0 md:group-hover:scale-x-100"
          />
        </a>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6">
          <SocialLinks size={22} />

          {/*
            download hints the filename to the browser; target and rel are the
            safety pair for opening it in a new tab. The file is served straight
            from /public by the static export.
          */}
          <a
            href={CV_PATH}
            download
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-body transition-colors duration-200 hover:text-accent"
          >
            {copy.downloadCv}
            <ArrowUpRightIcon
              width={15}
              height={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>

        {/* Contact form */}
        <div className="retro-terminal-form mt-20 max-w-xl">
          <p className="retro-terminal-prompt mb-5">MESSAGE BUFFER // READY</p>
          {formStatus === "success" ? (
            <div
              role="status"
              className="rounded-2xl border border-accent/30 bg-accent/5 px-8 py-10 text-center"
            >
              <p className="font-display text-xl font-semibold text-accent">
                {formCopy.successHeading}
              </p>
              <p className="mt-2 text-muted">{formCopy.successBody}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { void handleSubmit(e); }}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={formCopy.namePlaceholder}
                  className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-body placeholder:text-muted/60 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-shadow"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={formCopy.emailPlaceholder}
                  className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-body placeholder:text-muted/60 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-shadow"
                />
              </div>

              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={formCopy.messagePlaceholder}
                className="resize-none rounded-xl border border-line bg-surface px-4 py-3 text-sm text-body placeholder:text-muted/60 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-shadow"
              />

              {formStatus === "error" && (
                <p role="alert" className="text-sm text-red-400">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="self-start rounded-xl border border-accent px-6 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formStatus === "sending" ? formCopy.sending : formCopy.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
