"use client";

import Image from "next/image";
import Link from "next/link";
import type { ResolvedProject } from "@/lib/data";
import { useLanguage } from "@/components/layout/LanguageProvider";

const copy = {
  en: {
    back: "Back to projects",
    eyebrow: "Production case study",
    title: "A barcode scanner that could survive the real world",
    intro:
      "At Limpidius, I replaced a paid browser scanning SDK with an in-house Angular library for retail teams using ordinary phones in stores and warehouses.",
    stats: [
      ["~3,000", "scans per day in production"],
      ["2 threads", "camera and decoding kept apart"],
      ["0", "native app installs required"],
    ],
    fieldEyebrow: "In the field",
    // Placeholder copy written for the mockup: replace with Anis's own words before shipping.
    field:
      "The library runs in an ordinary browser tab on store phones: no native install, no dedicated hardware. Camera capture stays on the main thread; decoding happens in a worker.",
    sections: [
      {
        title: "The system",
        body: "The browser captures camera frames on the main thread and transfers them to a Web Worker. WebGL handles preprocessing, while ZBar and region-of-interest detection run through WebAssembly. Sharpness gating rejects poor frames early, and a result is confirmed across multiple frames before it reaches the host application.",
      },
      {
        title: "The bug that mattered",
        body: "Android worked. iOS did not. Safari exposed camera dimensions in a different orientation from the pixels arriving in the worker, so the scanner was cropping the wrong part of the frame. I traced the display, corrected-frame, and raw-sensor coordinate spaces, then fixed the crop mapping and delayed startup until the host container had real dimensions.",
      },
      {
        title: "Making performance measurable",
        body: "Once the scanner was live, I built the telemetry path behind it: validated session data moved from the browser to a NestJS service, BigQuery, and Grafana. The resulting dashboard gave the team visibility into success rates, device failures, scan duration, and manual-entry recovery instead of relying on anecdotes.",
      },
    ],
    outcomeTitle: "Outcome",
    outcome:
      "The library replaced the commercial dependency and shipped to production across retail tenants. The work combined performance engineering, device-level debugging, and the judgment to measure whether the system was actually helping users.",
    previousCaption: "Back to",
    previousLabel: "Projects",
    nextCaption: "Next",
    nextLabel: "Contact",
  },
  fr: {
    back: "Retour aux projets",
    eyebrow: "Étude de cas en production",
    title: "Un scanner de codes-barres conçu pour le terrain",
    intro:
      "Chez Limpidius, j'ai remplacé un SDK de scan payant par une bibliothèque Angular interne pour des équipes retail utilisant des téléphones classiques en magasin et en entrepôt.",
    stats: [
      ["~3 000", "scans par jour en production"],
      ["2 threads", "caméra et décodage séparés"],
      ["0", "installation native nécessaire"],
    ],
    fieldEyebrow: "Sur le terrain",
    field:
      "La bibliothèque fonctionne dans un simple onglet de navigateur sur les téléphones du magasin : aucune installation native, aucun matériel dédié. La capture caméra reste sur le thread principal, le décodage se fait dans un worker.",
    sections: [
      {
        title: "Le système",
        body: "Le navigateur capture les images caméra sur le thread principal et les transfère vers un Web Worker. WebGL réalise le prétraitement, tandis que ZBar et la détection de région d'intérêt passent par WebAssembly. Un filtre de netteté écarte rapidement les images inutilisables et le résultat est confirmé sur plusieurs images avant d'être transmis à l'application.",
      },
      {
        title: "Le bug déterminant",
        body: "Android fonctionnait. iOS non. Safari exposait les dimensions de la caméra dans une orientation différente des pixels reçus par le worker : le scanner découpait donc la mauvaise zone. J'ai suivi les espaces de coordonnées de l'affichage, de l'image corrigée et du capteur brut, puis corrigé le mapping et retardé le démarrage jusqu'à ce que le conteneur ait de vraies dimensions.",
      },
      {
        title: "Rendre la performance mesurable",
        body: "Après la mise en production, j'ai construit la chaîne de télémétrie : les sessions validées passaient du navigateur à un service NestJS, BigQuery puis Grafana. Le tableau de bord permettait de suivre les taux de réussite, les appareils en échec, la durée des scans et la récupération par saisie manuelle.",
      },
    ],
    outcomeTitle: "Résultat",
    outcome:
      "La bibliothèque a remplacé la dépendance commerciale et a été déployée auprès de plusieurs clients retail. Le projet réunissait performance, débogage sur appareils réels et décisions d'architecture fondées sur des mesures.",
    previousCaption: "Retour",
    previousLabel: "Projets",
    nextCaption: "Suivant",
    nextLabel: "Contact",
  },
} as const;

export function LimpScannerCaseStudy({ project }: { project: ResolvedProject }) {
  const { language } = useLanguage();
  const content = copy[language];
  const screenshot = project.screenshots[0];

  return (
    <article className="mx-auto max-w-5xl px-6 pb-24 pt-10 md:px-8 lg:px-14 lg:pt-14">
      <Link href="/projects" className="text-[12.5px] text-muted transition-colors duration-200 hover:text-heading">
        ← {content.back}
      </Link>

      <header className="mt-[52px] max-w-[900px]">
        <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{content.eyebrow}</p>
        <h1 className="mt-5 text-[40px] leading-[1.02] tracking-[-0.015em] text-heading text-pretty lg:text-[66px]">
          {content.title}
        </h1>
        <p className="mt-7 max-w-[680px] text-lg font-light leading-[1.65] text-body-strong text-pretty">
          {content.intro}
        </p>
      </header>

      <dl className="mt-12 grid grid-cols-1 divide-y divide-line-soft border-y border-line md:grid-cols-3 md:divide-y-0">
        {content.stats.map(([value, label], index) => (
          <div
            key={label}
            className={`py-6 ${index > 0 ? "md:border-l md:border-line md:pl-8" : ""}`}
          >
            <dt className="font-serif text-[32px] leading-none text-heading">{value}</dt>
            <dd className="mt-2.5 max-w-[220px] text-[13px] font-light leading-[1.5] text-muted">
              {label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-9 grid grid-cols-1 items-start gap-10 border-t border-line pt-9 md:grid-cols-[340px_420px] md:gap-11">
        {screenshot ? (
          <Image
            src={screenshot}
            alt="Limpscanner in production"
            width={340}
            height={604}
            className="block aspect-[9/16] w-[340px] max-w-full border border-line object-cover"
          />
        ) : null}
        <div className="max-w-[520px]">
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{content.fieldEyebrow}</p>
          <p className="mt-3.5 text-[15px] font-light leading-[1.7] text-body">{content.field}</p>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-[52px]">
        {content.sections.map((section, index) => (
          <div
            key={section.title}
            className="grid grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14"
          >
            <div className="flex items-baseline gap-3 lg:block">
              <p className="font-serif text-2xl leading-none text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-[30px] leading-[1.1] text-heading lg:mt-3">
                {section.title}
              </h2>
            </div>
            <p className="max-w-[680px] text-[17px] font-light leading-[1.72] text-body text-pretty">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-16 border-t border-heading pt-7">
        <p className="text-[10.5px] uppercase tracking-[0.16em] text-heading">{content.outcomeTitle}</p>
        <p className="mt-5 max-w-[900px] font-serif text-[34px] leading-[1.28] text-heading text-pretty">
          {content.outcome}
        </p>
      </section>

      <nav aria-label="Page sequence" className="mt-14 grid grid-cols-1 gap-px border-t border-line sm:mt-[56px] sm:grid-cols-2">
        <Link href="/projects" className="group relative flex flex-col gap-[7px] py-[26px]">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-heading transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
          <span className="text-xs font-light text-muted">{content.previousCaption}</span>
          <span className="font-serif text-[26px] leading-none text-heading">{content.previousLabel}</span>
        </Link>
        <Link href="/contact" className="group relative flex flex-col gap-[7px] py-[26px] sm:items-end sm:text-right">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-heading transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
          <span className="text-xs font-light text-muted">{content.nextCaption}</span>
          <span className="font-serif text-[26px] leading-none text-heading">{content.nextLabel}</span>
        </Link>
      </nav>
    </article>
  );
}
