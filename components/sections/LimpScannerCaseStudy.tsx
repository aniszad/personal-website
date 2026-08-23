"use client";

import Link from "next/link";
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
    architectureTitle: "The system",
    architecture:
      "The browser captures camera frames on the main thread and transfers them to a Web Worker. WebGL handles preprocessing, while ZBar and region-of-interest detection run through WebAssembly. Sharpness gating rejects poor frames early, and a result is confirmed across multiple frames before it reaches the host application.",
    problemTitle: "The bug that mattered",
    problem:
      "Android worked. iOS did not. Safari exposed camera dimensions in a different orientation from the pixels arriving in the worker, so the scanner was cropping the wrong part of the frame. I traced the display, corrected-frame, and raw-sensor coordinate spaces, then fixed the crop mapping and delayed startup until the host container had real dimensions.",
    observabilityTitle: "Making performance measurable",
    observability:
      "Once the scanner was live, I built the telemetry path behind it: validated session data moved from the browser to a NestJS service, BigQuery, and Grafana. The resulting dashboard gave the team visibility into success rates, device failures, scan duration, and manual-entry recovery instead of relying on anecdotes.",
    outcomeTitle: "Outcome",
    outcome:
      "The library replaced the commercial dependency and shipped to production across retail tenants. The work combined performance engineering, device-level debugging, and the judgment to measure whether the system was actually helping users.",
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
    architectureTitle: "Le système",
    architecture:
      "Le navigateur capture les images caméra sur le thread principal et les transfère vers un Web Worker. WebGL réalise le prétraitement, tandis que ZBar et la détection de région d'intérêt passent par WebAssembly. Un filtre de netteté écarte rapidement les images inutilisables et le résultat est confirmé sur plusieurs images avant d'être transmis à l'application.",
    problemTitle: "Le bug déterminant",
    problem:
      "Android fonctionnait. iOS non. Safari exposait les dimensions de la caméra dans une orientation différente des pixels reçus par le worker : le scanner découpait donc la mauvaise zone. J'ai suivi les espaces de coordonnées de l'affichage, de l'image corrigée et du capteur brut, puis corrigé le mapping et retardé le démarrage jusqu'à ce que le conteneur ait de vraies dimensions.",
    observabilityTitle: "Rendre la performance mesurable",
    observability:
      "Après la mise en production, j'ai construit la chaîne de télémétrie : les sessions validées passaient du navigateur à un service NestJS, BigQuery puis Grafana. Le tableau de bord permettait de suivre les taux de réussite, les appareils en échec, la durée des scans et la récupération par saisie manuelle.",
    outcomeTitle: "Résultat",
    outcome:
      "La bibliothèque a remplacé la dépendance commerciale et a été déployée auprès de plusieurs clients retail. Le projet réunissait performance, débogage sur appareils réels et décisions d'architecture fondées sur des mesures.",
  },
} as const;

export function LimpScannerCaseStudy() {
  const { language } = useLanguage();
  const content = copy[language];

  return (
    <article className="mx-auto max-w-5xl px-6 pb-28 pt-8 md:px-10 md:pt-14">
      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
      >
        ← {content.back}
      </Link>

      <header className="mt-20 max-w-4xl border-b border-line pb-12 md:mt-28 md:pb-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          {content.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[0.98] text-heading md:text-7xl">
          {content.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body">
          {content.intro}
        </p>
      </header>

      <dl className="grid border-b border-line py-8 sm:grid-cols-3">
        {content.stats.map(([value, label]) => (
          <div key={label} className="border-line py-3 sm:border-l sm:px-6 first:sm:border-l-0 first:sm:pl-0">
            <dt className="font-mono text-2xl text-accent">{value}</dt>
            <dd className="mt-2 max-w-[14rem] text-sm leading-relaxed text-muted">{label}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-16 pt-16 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-20 md:pt-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">01</p>
          <h2 className="mt-4 text-3xl text-heading">{content.architectureTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-body">{content.architecture}</p>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">02</p>
          <h2 className="mt-4 text-3xl text-heading">{content.problemTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-body">{content.problem}</p>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">03</p>
          <h2 className="mt-4 text-3xl text-heading">{content.observabilityTitle}</h2>
        </div>
        <p className="text-lg leading-relaxed text-body">{content.observability}</p>
      </div>

      <section className="mt-20 border-t border-accent pt-8 md:mt-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{content.outcomeTitle}</p>
        <p className="mt-5 max-w-3xl text-2xl leading-snug text-heading md:text-4xl">
          {content.outcome}
        </p>
      </section>
    </article>
  );
}
