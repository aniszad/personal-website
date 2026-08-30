"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { SOCIALS } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

type FormStatus = "idle" | "sending" | "success" | "error";

export function Contact() {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const formCopy = copy.contactForm;
  const meta = copy.contactMeta;

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
    <FadeInOnScroll className="grid grid-cols-1 items-start gap-11 md:grid-cols-[minmax(0,1fr)_320px] md:gap-16">
      <div className="flex max-w-[620px] flex-col gap-[22px]">
        {formStatus === "success" || formStatus === "error" ? (
          <p
            role="status"
            className={`text-[15px] ${formStatus === "success" ? "text-heading" : "text-body-strong"}`}
          >
            {formStatus === "success" ? formCopy.successBody : errorMsg || formCopy.errorFallback}
          </p>
        ) : (
          <form
            onSubmit={(e) => { void handleSubmit(e); }}
            noValidate
            className="flex flex-col gap-[22px]"
          >
            <Field
              eyebrow={formCopy.nameLabel}
              type="text"
              value={name}
              onChange={setName}
              placeholder={formCopy.namePlaceholder}
            />
            <Field
              eyebrow={formCopy.emailLabel}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder={formCopy.emailPlaceholder}
            />

            <div>
              <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">
                {formCopy.messageLabel}
              </p>
              <textarea
                required
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={formCopy.messagePlaceholder}
                className="mt-2.5 w-full resize-none border-b border-line bg-transparent pb-[66px] text-[15px] font-light text-body placeholder:text-muted focus:border-heading focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="mt-1.5 self-start border-b border-heading pb-1.5 text-[15px] font-medium text-heading disabled:opacity-50"
            >
              {formStatus === "sending" ? formCopy.sending : formCopy.send}
            </button>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-[22px] border-line pt-8 md:border-l md:pl-7 md:pt-0">
        <MetaBlock label={meta.directLabel}>
          <a
            href={`mailto:${SOCIALS.email}`}
            className="block text-[15px] leading-[1.4] text-heading transition-colors duration-200 hover:text-body-strong"
          >
            {SOCIALS.email}
          </a>
        </MetaBlock>

        <MetaBlock label={meta.elsewhereLabel}>
          <div className="flex flex-col gap-2">
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[14.5px] leading-[1.4] text-body-strong transition-colors duration-200 hover:text-heading"
            >
              GitHub ↗
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[14.5px] leading-[1.4] text-body-strong transition-colors duration-200 hover:text-heading"
            >
              LinkedIn ↗
            </a>
          </div>
        </MetaBlock>

        <MetaBlock label={meta.basedInLabel}>
          <p className="text-[14.5px] leading-[1.4] text-body-strong">{meta.basedInValue}</p>
        </MetaBlock>

        <MetaBlock label={meta.responseLabel}>
          <p className="text-[14.5px] leading-[1.4] text-body-strong">{meta.responseValue}</p>
        </MetaBlock>
      </div>
    </FadeInOnScroll>
  );
}

function Field({
  eyebrow,
  type,
  value,
  onChange,
  placeholder,
}: {
  eyebrow: string;
  type: "text" | "email";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2.5 w-full border-b border-line bg-transparent pb-[11px] text-[15px] font-light text-body placeholder:text-muted focus:border-heading focus:outline-none"
      />
    </div>
  );
}

function MetaBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
