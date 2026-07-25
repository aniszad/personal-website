export type Language = "en" | "fr";

type PageCopy = {
  label: string;
  title: string;
  blurb: string;
};

const PAGE_COPY: Record<Language, Record<string, PageCopy>> = {
  en: {
    "/about": {
      label: "About",
      title: "About",
      blurb: "Engineering student, production developer, and the path between the two.",
    },
    "/experience": {
      label: "Experience",
      title: "Experience",
      blurb: "Three roles, from a bus fleet system in Béjaïa to a scanner running in French retail.",
    },
    "/projects": {
      label: "Projects",
      title: "Projects",
      blurb: "From a scanner running in French retail to a deep learning timetable planner.",
    },
    "/education": {
      label: "Education",
      title: "Education",
      blurb: "From ESTIN in Algeria to a Master's in Artificial Intelligence at Université de Lille.",
    },
    "/skills": {
      label: "Skills",
      title: "Skills",
      blurb: "The languages, frameworks, and infrastructure I actually reach for.",
    },
    "/contact": {
      label: "Contact",
      title: "Get in Touch",
      blurb: "Looking for an alternance from September 2026, in and around Lille.",
    },
  },
  fr: {
    "/about": {
      label: "Profil",
      title: "Profil",
      blurb: "Etudiant en ingenierie, developpeur en production, et le lien entre les deux.",
    },
    "/experience": {
      label: "Experience",
      title: "Experience",
      blurb: "Trois roles, du systeme de flotte bus a Bejaia au scanner en production dans le retail en France.",
    },
    "/projects": {
      label: "Projets",
      title: "Projets",
      blurb: "Du scanner en production dans le retail a un planificateur d'emploi du temps en deep learning.",
    },
    "/education": {
      label: "Formation",
      title: "Formation",
      blurb: "D'ESTIN en Algerie au Master d'Intelligence Artificielle a l'Universite de Lille.",
    },
    "/skills": {
      label: "Competences",
      title: "Competences",
      blurb: "Les langages, frameworks et outils d'infrastructure que j'utilise vraiment.",
    },
    "/contact": {
      label: "Contact",
      title: "Me contacter",
      blurb: "En recherche d'alternance a partir de septembre 2026, a Lille et autour.",
    },
  },
};

const HOME_COPY = {
  en: {
    indexLabel: "Sections",
    footerBuiltWith: "Built with Next.js and Tailwind CSS.",
    startWithWork: "Start with the work",
    getInTouch: "Get in touch",
    availability: "Open for alternance, September 2026",
    location: "Lille, France",
    tagline:
      "An engineering cycle in AI and Data Science at ESTIN, a stage spent shipping production code at Limpidius, and a Master's in Artificial Intelligence at Universite de Lille from this September.",
    rotatingTitle: {
      start: "I build",
      end: "that ship",
      middle: [
        "websites and web apps",
        "mobile apps",
        "AI and data systems",
      ],
    },
  },
  fr: {
    indexLabel: "Sections",
    footerBuiltWith: "Cree avec Next.js et Tailwind CSS.",
    startWithWork: "Voir les projets",
    getInTouch: "Me contacter",
    availability: "Disponible pour une alternance, septembre 2026",
    location: "Lille, France",
    tagline:
      "Formation en IA et Data Science a ESTIN, stage en production chez Limpidius, et Master en Intelligence Artificielle a l'Universite de Lille a partir de septembre.",
    rotatingTitle: {
      start: "Je construis",
      end: "qui livrent",
      middle: [
        "des sites et apps web",
        "des applications mobiles",
        "des systemes IA et data",
      ],
    },
  },
} as const;

const GENERIC_COPY = {
  en: {
    previous: "Previous",
    next: "Next",
    backTo: "Back to",
    index: "Index",
    siteSections: "Site sections",
    pageSequence: "Page sequence",
    downloadCv: "Download CV",
    contactLead:
      "I am looking for an alternance starting September 2026 in AI, Data Science, or Software Engineering, in and around Lille.",
    contactBody:
      "If you would like to work together, or you just want to ask about something I built, write to me.",
    aboutParagraphs: [
      "I am a Master's student in Artificial Intelligence at Universite de Lille, with an engineering background in AI and Data Science from ESTIN in Algeria. Most of what I enjoy sits where machine learning meets software that real people actually use.",
      "I recently finished a four month development internship at Limpidius, based at EuraTechnologies in Lille. I shipped a browser based barcode scanning library that runs in production at Castorama and other retail clients, handling roughly 3,000 scans a day. Getting GPU image processing and a WASM decoder to cooperate inside a browser tab taught me more about performance than any course did.",
      "I move across the stack comfortably: frontend in Angular and React, backend in NestJS and Spring Boot, mobile in Kotlin, and ML pipelines in Python. I am currently looking for an alternance starting September 2026 in AI, Data Science, or software engineering around Lille.",
    ],
    skillsCategory: {
      Languages: "Languages",
      Frontend: "Frontend",
      Backend: "Backend",
      "AI and Data": "AI and Data",
      Mobile: "Mobile",
      "Cloud and Infrastructure": "Cloud and Infrastructure",
      Tools: "Tools",
    } as Record<string, string>,
  },
  fr: {
    previous: "Precedent",
    next: "Suivant",
    backTo: "Retour",
    index: "Accueil",
    siteSections: "Sections du site",
    pageSequence: "Sequence des pages",
    downloadCv: "Telecharger le CV",
    contactLead:
      "Je recherche une alternance a partir de septembre 2026 en IA, Data Science ou Software Engineering, a Lille et sa metropole.",
    contactBody:
      "Si vous souhaitez collaborer avec moi, ou simplement echanger sur ce que j'ai construit, ecrivez-moi.",
    aboutParagraphs: [
      "Je suis etudiant en Master d'Intelligence Artificielle a l'Universite de Lille, avec une formation d'ingenieur en IA et Data Science a ESTIN en Algerie. Ce qui me passionne, c'est l'endroit ou le machine learning rencontre des logiciels utilises en vrai.",
      "J'ai recemment termine un stage de quatre mois chez Limpidius a EuraTechnologies (Lille). J'y ai livre une bibliotheque de scan de codes-barres dans le navigateur, en production chez Castorama et d'autres clients retail, avec environ 3 000 scans par jour. Faire cooperer traitement GPU d'image et decodeur WASM dans un onglet navigateur m'a appris plus sur la performance que beaucoup de cours.",
      "Je suis a l'aise sur toute la stack : frontend en Angular et React, backend en NestJS et Spring Boot, mobile en Kotlin, et pipelines ML en Python. Je cherche actuellement une alternance a partir de septembre 2026 en IA, Data Science ou software engineering autour de Lille.",
    ],
    skillsCategory: {
      Languages: "Langages",
      Frontend: "Frontend",
      Backend: "Backend",
      "AI and Data": "IA et Data",
      Mobile: "Mobile",
      "Cloud and Infrastructure": "Cloud et Infrastructure",
      Tools: "Outils",
    } as Record<string, string>,
  },
} as const;

export function getPageCopy(language: Language, href: string): PageCopy {
  return PAGE_COPY[language][href] ?? PAGE_COPY.en[href];
}

export function getLocalizedPages<T extends { href: string }>(
  language: Language,
  pages: readonly T[],
) {
  return pages.map((page) => ({
    ...page,
    ...getPageCopy(language, page.href),
  }));
}

export function t(language: Language) {
  return {
    home: HOME_COPY[language],
    generic: GENERIC_COPY[language],
  };
}

export function localizeSkillCategory(language: Language, name: string): string {
  return GENERIC_COPY[language].skillsCategory[name] ?? name;
}
