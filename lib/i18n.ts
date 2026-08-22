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
      blurb: "Étudiant en ingénierie, développeur en production, et le lien entre les deux.",
    },
    "/experience": {
      label: "Expérience",
      title: "Expérience",
      blurb: "Trois rôles, du système de flotte bus à Béjaïa au scanner en production dans le retail en France.",
    },
    "/projects": {
      label: "Projets",
      title: "Projets",
      blurb: "Du scanner en production dans le retail à un planificateur d'emploi du temps en deep learning.",
    },
    "/education": {
      label: "Formation",
      title: "Formation",
      blurb: "D'ESTIN en Algérie au Master d'Intelligence Artificielle à l'Université de Lille.",
    },
    "/skills": {
      label: "Compétences",
      title: "Compétences",
      blurb: "Les langages, frameworks et outils d'infrastructure que j'utilise vraiment.",
    },
    "/contact": {
      label: "Contact",
      title: "Me contacter",
      blurb: "En recherche d'alternance à partir de septembre 2026, à Lille et alentours.",
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
    footerBuiltWith: "Créé avec Next.js et Tailwind CSS.",
    startWithWork: "Voir les projets",
    getInTouch: "Me contacter",
    availability: "Disponible pour une alternance, septembre 2026",
    location: "Lille, France",
    tagline:
      "Formation en IA et Data Science à ESTIN, stage en production chez Limpidius, et Master en Intelligence Artificielle à l'Université de Lille à partir de septembre.",
    rotatingTitle: {
      start: "Je construis",
      end: "qui livrent",
      middle: [
        "des sites et apps web",
        "des applications mobiles",
        "des systèmes IA et data",
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
    openMenu: "Open menu",
    pageSequence: "Page sequence",
    downloadCv: "Download CV",
    commandPalette: {
      trigger: "Search",
      placeholder: "Type a command or search…",
      empty: "No matching command.",
      groupGo: "Go to",
      groupActions: "Actions",
      home: "Home",
      askAssistant: "Ask the assistant",
      askAssistantHint: "Open the chat and ask a question",
      inspectPage: "Inspect this page",
      inspectPageHint: "See the technical decisions behind this interface",
      copyEmail: "Copy email address",
      copyEmailHint: "anis.zadri8@gmail.com",
      copyEmailDone: "Email copied",
      downloadCv: "Download CV",
      downloadCvHint: "Opens the PDF in a new tab",
      openGithub: "Open GitHub",
      openLinkedin: "Open LinkedIn",
      switchToFrench: "Switch to French",
      switchToEnglish: "Switch to English",
      hint: "Navigate",
      hintSelect: "Select",
      hintClose: "Close",
    },
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
    contactForm: {
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder: "What would you like to talk about?",
      send: "Send message",
      sending: "Sending…",
      successHeading: "Message sent",
      successBody: "Thanks — I will get back to you soon.",
      errorFallback: "Something went wrong. Please try again or email directly.",
    },
  },
  fr: {
    previous: "Précédent",
    next: "Suivant",
    backTo: "Retour",
    index: "Accueil",
    siteSections: "Sections du site",
    openMenu: "Ouvrir le menu",
    pageSequence: "Séquence des pages",
    downloadCv: "Télécharger le CV",
    commandPalette: {
      trigger: "Rechercher",
      placeholder: "Tapez une commande ou une recherche…",
      empty: "Aucune commande correspondante.",
      groupGo: "Aller à",
      groupActions: "Actions",
      home: "Accueil",
      askAssistant: "Interroger l'assistant",
      askAssistantHint: "Ouvre le chat et posez une question",
      inspectPage: "Inspecter cette page",
      inspectPageHint: "Voir les décisions techniques derrière cette interface",
      copyEmail: "Copier l'adresse e-mail",
      copyEmailHint: "anis.zadri8@gmail.com",
      copyEmailDone: "E-mail copié",
      downloadCv: "Télécharger le CV",
      downloadCvHint: "Ouvre le PDF dans un nouvel onglet",
      openGithub: "Ouvrir GitHub",
      openLinkedin: "Ouvrir LinkedIn",
      switchToFrench: "Passer en français",
      switchToEnglish: "Passer en anglais",
      hint: "Naviguer",
      hintSelect: "Sélectionner",
      hintClose: "Fermer",
    },
    contactLead:
      "Je recherche une alternance à partir de septembre 2026 en IA, Data Science ou Software Engineering, à Lille et sa métropole.",
    contactBody:
      "Si vous souhaitez collaborer avec moi, ou simplement échanger sur ce que j'ai construit, écrivez-moi.",
    aboutParagraphs: [
      "Je suis étudiant en Master d'Intelligence Artificielle à l'Université de Lille, avec une formation d'ingénieur en IA et Data Science à ESTIN en Algérie. Ce qui me passionne, c'est l'endroit où le machine learning rencontre des logiciels utilisés en vrai.",
      "J'ai récemment terminé un stage de quatre mois chez Limpidius à EuraTechnologies (Lille). J'y ai livré une bibliothèque de scan de codes-barres dans le navigateur, en production chez Castorama et d'autres clients retail, avec environ 3 000 scans par jour. Faire coopérer traitement GPU d'image et décodeur WASM dans un onglet navigateur m'a appris plus sur la performance que beaucoup de cours.",
      "Je suis à l'aise sur toute la stack : frontend en Angular et React, backend en NestJS et Spring Boot, mobile en Kotlin, et pipelines ML en Python. Je cherche actuellement une alternance à partir de septembre 2026 en IA, Data Science ou software engineering autour de Lille.",
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
    contactForm: {
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votre@email.com",
      messagePlaceholder: "De quoi souhaitez-vous parler ?",
      send: "Envoyer",
      sending: "Envoi…",
      successHeading: "Message envoyé",
      successBody: "Merci — je vous répondrai bientôt.",
      errorFallback: "Une erreur est survenue. Réessayez ou écrivez-moi directement.",
    },
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
