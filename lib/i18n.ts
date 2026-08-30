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
    footerBuiltWith: "Built with Next.js and Tailwind CSS.",
    startWithWork: "Start with the work",
    getInTouch: "Get in touch",
    location: "Lille, France",
    tagline:
      "An engineering cycle in AI and Data Science at ESTIN, a stage spent shipping production code at Limpidius, and a Master's in Artificial Intelligence at Université de Lille from this September.",
    headline: {
      start: "I build",
      middle: ["websites and web apps", "mobile apps", "AI and data systems"],
      end: "that ship",
    },
    status: {
      currentlyLabel: "Currently",
      currentlyValue: ["AI Engineer Intern, Limpidius", "EuraTechnologies, Lille"],
      fromLabel: "From September",
      fromValue: ["MSc Artificial Intelligence", "Université de Lille"],
      availableLabel: "Available",
      availableValue: "Alternance, September 2026",
    },
    metrics: [
      {
        value: "3,000",
        caption: "scans a day through the barcode library, in French retail",
      },
      {
        value: "Three",
        caption:
          "roles, from a bus fleet system in Béjaïa to production retail software",
      },
      { value: "Open source", caption: "Android library published on JitPack" },
    ],
    featured: {
      eyebrow: "Selected work",
      cta: "Read the case study",
      caption: "Scanning a product label in store",
    },
  },
  fr: {
    footerBuiltWith: "Créé avec Next.js et Tailwind CSS.",
    startWithWork: "Voir les projets",
    getInTouch: "Me contacter",
    location: "Lille, France",
    tagline:
      "Formation en IA et Data Science à ESTIN, stage en production chez Limpidius, et Master en Intelligence Artificielle à l'Université de Lille à partir de septembre.",
    headline: {
      start: "Je construis",
      middle: ["des sites et apps web", "des applications mobiles", "des systèmes IA et data"],
      end: "qui livrent",
    },
    status: {
      currentlyLabel: "Actuellement",
      currentlyValue: ["Stagiaire ingénieur IA, Limpidius", "EuraTechnologies, Lille"],
      fromLabel: "Dès septembre",
      fromValue: ["Master en Intelligence Artificielle", "Université de Lille"],
      availableLabel: "Disponible",
      availableValue: "Alternance, septembre 2026",
    },
    metrics: [
      {
        value: "3 000",
        caption:
          "scans par jour via la bibliothèque de codes-barres, dans le retail français",
      },
      {
        value: "Trois",
        caption:
          "rôles, d'un système de flotte de bus à Béjaïa à un logiciel retail en production",
      },
      { value: "Open source", caption: "Bibliothèque Android publiée sur JitPack" },
    ],
    featured: {
      eyebrow: "Travail sélectionné",
      cta: "Lire l'étude de cas",
      caption: "Scan d'une étiquette produit en magasin",
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
    closeMenu: "Close menu",
    pageSequence: "Page sequence",
    downloadCv: "Download CV",
    technologiesUsedAt: "Technologies used at",
    technologiesUsedIn: "Technologies used in",
    sourceOnGithub: "source on GitHub (opens in a new tab)",
    liveDemo: "live demo (opens in a new tab)",
    featured: "Featured",
    proprietarySource: "Proprietary source",
    featuredProprietary: "Featured, proprietary source",
    caseStudy: "Case study",
    projectIndex: "Index",
    currentRole: "Current",
    startingSoon: "Starting",
    error: { heading: "Something went wrong", body: "An unexpected error occurred. Try refreshing the page or going back.", retry: "Try again", home: "Go home" },
    commandPalette: {
      trigger: "Search",
      placeholder: "Type a command or search…",
      empty: "No matching command.",
      groupGo: "Go to",
      groupActions: "Actions",
      home: "Home",
      askAssistant: "Ask the assistant",
      askAssistantHint: "Open the chat and ask a question",
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
    chat: {
      quickPrompts: ["Tell me about your background", "What projects are you proud of?", "What role are you looking for?"],
      welcome: "Hi, I am {name}'s portfolio assistant. Ask me about projects, experience, skills, or availability.",
      ready: "Ready to chat",
      thinking: "Thinking...",
      ask: "Assistant",
      close: "Close chat",
      messages: "Chat messages",
      hideSuggestions: "Hide suggestions",
      showSuggestions: "Show suggestions",
      placeholder: "Ask a question... (Shift+Enter for new line)",
      send: "Send",
      statusError: "Unable to answer right now: {error}",
    },
    gallery: {
      playVideo: "Play the {name} demonstration video",
      enlargeScreenshot: "Enlarge screenshot {number} for {name}",
      demonstrationVideo: "Demonstration video",
      enlarge: "Enlarge",
      close: "Close",
      demonstration: "Demonstration. Press Escape to close.",
      pressEscape: "Press Escape to close.",
    },
    contactLead:
      "I am looking for an alternance starting September 2026 in AI, Data Science, or Software Engineering, in and around Lille.",
    contactBody:
      "If you would like to work together, or you just want to ask about something I built, write to me.",
    aboutParagraphs: [
      "I am a Master's student in Artificial Intelligence at Université de Lille, with an engineering background in AI and Data Science from ESTIN in Algeria. Most of what I enjoy sits where machine learning meets software that real people actually use.",
      "I recently finished a five month development internship at Limpidius, based at EuraTechnologies in Lille. I shipped a browser based barcode scanning library that runs in production at Castorama and other retail clients, handling roughly 3,000 scans a day. Getting GPU image processing and a WASM decoder to cooperate inside a browser tab taught me more about performance than any course did.",
      "I move across the stack comfortably: frontend in Angular and React, backend in NestJS and Spring Boot, mobile in Kotlin, and ML pipelines in Python. I am currently looking for an alternance starting September 2026 in AI, Data Science, or software engineering around Lille.",
    ],
    aboutMeta: {
      downloadCv: "Download CV (PDF)",
      basedInLabel: "Based in",
      basedInValue: "Lille, France",
      languagesLabel: "Languages",
      languagesValue: "FR · EN",
      lookingForLabel: "Looking for",
      lookingForValue: "Alternance, Sept 2026",
    },
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
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      messageLabel: "Message",
      messagePlaceholder: "What you are working on",
      send: "Send message",
      sending: "Sending…",
      successHeading: "Message sent",
      successBody: "Thanks, I will get back to you soon.",
      errorFallback: "Something went wrong. Please try again or email directly.",
    },
    // Response time is a placeholder pending confirmation from Anis (not in the repo).
    contactMeta: {
      directLabel: "Direct",
      elsewhereLabel: "Elsewhere",
      basedInLabel: "Based in",
      basedInValue: "Lille, France",
      responseLabel: "Response",
      responseValue: "Usually within a day",
    },
  },
  fr: {
    previous: "Précédent",
    next: "Suivant",
    backTo: "Retour",
    index: "Accueil",
    siteSections: "Sections du site",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    pageSequence: "Séquence des pages",
    downloadCv: "Télécharger le CV",
    technologiesUsedAt: "Technologies utilisées chez",
    technologiesUsedIn: "Technologies utilisées dans",
    sourceOnGithub: "code source sur GitHub (ouvre un nouvel onglet)",
    liveDemo: "démo en ligne (ouvre un nouvel onglet)",
    featured: "À la une",
    proprietarySource: "Code propriétaire",
    featuredProprietary: "À la une, code propriétaire",
    caseStudy: "Étude de cas",
    projectIndex: "Index",
    currentRole: "En cours",
    startingSoon: "Bientôt",
    error: { heading: "Une erreur est survenue", body: "Une erreur inattendue s'est produite. Actualisez la page ou revenez en arrière.", retry: "Réessayer", home: "Accueil" },
    commandPalette: {
      trigger: "Rechercher",
      placeholder: "Tapez une commande ou une recherche…",
      empty: "Aucune commande correspondante.",
      groupGo: "Aller à",
      groupActions: "Actions",
      home: "Accueil",
      askAssistant: "Interroger l'assistant",
      askAssistantHint: "Ouvre le chat et posez une question",
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
    chat: {
      quickPrompts: ["Parlez-moi de votre parcours", "De quels projets êtes-vous le plus fier ?", "Quel poste recherchez-vous ?"],
      welcome: "Bonjour, je suis l'assistant du portfolio de {name}. Posez-moi une question sur les projets, l'expérience, les compétences ou la disponibilité.",
      ready: "Prêt à discuter",
      thinking: "Réflexion...",
      ask: "Assistant",
      close: "Fermer le chat",
      messages: "Messages du chat",
      hideSuggestions: "Masquer les suggestions",
      showSuggestions: "Afficher les suggestions",
      placeholder: "Posez une question... (Maj+Entrée pour un retour à la ligne)",
      send: "Envoyer",
      statusError: "Impossible de répondre pour le moment : {error}",
    },
    gallery: {
      playVideo: "Lire la démonstration vidéo de {name}",
      enlargeScreenshot: "Agrandir la capture {number} de {name}",
      demonstrationVideo: "Vidéo de démonstration",
      enlarge: "Agrandir",
      close: "Fermer",
      demonstration: "Démonstration. Appuyez sur Échap pour fermer.",
      pressEscape: "Appuyez sur Échap pour fermer.",
    },
    contactLead:
      "Je recherche une alternance à partir de septembre 2026 en IA, Data Science ou Software Engineering, à Lille et sa métropole.",
    contactBody:
      "Si vous souhaitez collaborer avec moi, ou simplement échanger sur ce que j'ai construit, écrivez-moi.",
    aboutParagraphs: [
      "Je suis étudiant en Master d'Intelligence Artificielle à l'Université de Lille, avec une formation d'ingénieur en IA et Data Science à ESTIN en Algérie. Ce qui me passionne, c'est l'endroit où le machine learning rencontre des logiciels utilisés en vrai.",
      "J'ai récemment terminé un stage de cinq mois chez Limpidius à EuraTechnologies (Lille). J'y ai livré une bibliothèque de scan de codes-barres dans le navigateur, en production chez Castorama et d'autres clients retail, avec environ 3 000 scans par jour. Faire coopérer traitement GPU d'image et décodeur WASM dans un onglet navigateur m'a appris plus sur la performance que beaucoup de cours.",
      "Je suis à l'aise sur toute la stack : frontend en Angular et React, backend en NestJS et Spring Boot, mobile en Kotlin, et pipelines ML en Python. Je cherche actuellement une alternance à partir de septembre 2026 en IA, Data Science ou software engineering autour de Lille.",
    ],
    aboutMeta: {
      downloadCv: "Télécharger le CV (PDF)",
      basedInLabel: "Basé à",
      basedInValue: "Lille, France",
      languagesLabel: "Langues",
      languagesValue: "FR · EN",
      lookingForLabel: "Recherche",
      lookingForValue: "Alternance, sept. 2026",
    },
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
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      emailLabel: "Email",
      emailPlaceholder: "vous@entreprise.com",
      messageLabel: "Message",
      messagePlaceholder: "Ce sur quoi vous travaillez",
      send: "Envoyer",
      sending: "Envoi…",
      successHeading: "Message envoyé",
      successBody: "Merci, je vous répondrai bientôt.",
      errorFallback: "Une erreur est survenue. Réessayez ou écrivez-moi directement.",
    },
    contactMeta: {
      directLabel: "Contact direct",
      elsewhereLabel: "Ailleurs",
      basedInLabel: "Basé à",
      basedInValue: "Lille, France",
      responseLabel: "Réponse",
      responseValue: "Généralement sous 24h",
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

const CONTENT_TRANSLATIONS: Record<string, string> = {
  "AI Engineer Intern": "Stagiaire ingénieur IA",
  "Software Engineering Intern": "Stagiaire ingénieur logiciel",
  "Freelance Developer": "Développeur freelance",
  "Ongoing": "En cours",
  "Featured": "À la une",
  "Proprietary source": "Code propriétaire",
  "Built a production Angular barcode scanning library using WebGL shaders for GPU image processing, ZBar compiled to WebAssembly, and Web Workers to keep decoding off the main thread.": "Création d'une bibliothèque Angular de scan de codes-barres en production, utilisant des shaders WebGL pour le traitement GPU, ZBar compilé en WebAssembly et des Web Workers pour garder le décodage hors du thread principal.",
  "Deployed to Castorama and other retail clients, where it processes roughly 3,000 scans per day.": "Déployée chez Castorama et d'autres clients du retail, où elle traite environ 3 000 scans par jour.",
  "Built tenant-stats, a NestJS observability microservice storing scan telemetry in BigQuery and surfacing it through Grafana dashboards.": "Création de tenant-stats, un microservice d'observabilité NestJS stockant les données de scan dans BigQuery et les présentant dans des tableaux de bord Grafana.",
  "Built a bus fleet management system pairing a Spring Boot REST API with a native Android client written in Kotlin.": "Création d'un système de gestion de flotte de bus associant une API REST Spring Boot à un client Android natif écrit en Kotlin.",
  "Implemented real time vehicle tracking, route management, and driver assignment.": "Mise en place du suivi des véhicules en temps réel, de la gestion des itinéraires et de l'affectation des conducteurs.",
  "Delivered web and mobile projects for independent clients, covering frontend, backend, and Android work.": "Réalisation de projets web et mobiles pour des clients indépendants, du frontend au backend et à Android.",
  "Engineering Cycle in Computer Science": "Cycle ingénieur en informatique",
  "Master 1 in AI and Data Science": "Master 1 en IA et Data Science",
  "Licence 3 Informatique": "Licence 3 Informatique",
  "Master 1 Intelligence Artificielle": "Master 1 Intelligence Artificielle",
  "Open source Android library published on JitPack for previewing Google Drive files natively, without handing users off to an external app.": "Bibliothèque Android open source publiée sur JitPack pour prévisualiser nativement des fichiers Google Drive, sans rediriger l'utilisateur vers une autre application.",
  "Production browser based 1D and 2D barcode scanner. An Angular library using WebGL for GPU image processing, ZBar via WebAssembly, and a multi stage pipeline with region of interest localization. Running at Castorama.": "Scanner de codes-barres 1D et 2D dans le navigateur, en production. Bibliothèque Angular utilisant WebGL pour le traitement GPU, ZBar via WebAssembly et un pipeline multi-étapes avec localisation de région d'intérêt. Déployé chez Castorama.",
  "Automatic timetable generation for a university, framed as sequential decision making under hard constraints. A PyTorch policy places one assignment at a time, masked to only the moves the constraints allow, so every schedule it builds is valid by construction. Reinforcement learning then tunes that policy against the quality of the whole timetable rather than any single slot.": "Génération automatique d'emplois du temps universitaires sous contraintes strictes. Une politique PyTorch place chaque cours un par un, avec un masque limitant les choix aux mouvements autorisés, afin que chaque emploi du temps soit valide par construction. L'apprentissage par renforcement optimise ensuite la qualité globale de l'emploi du temps.",
  "Supervised classification on medical data, comparing logistic regression, random forest, and XGBoost with hyperparameter tuning and cross validation. Scored on F1 and ROC AUC, with attention to fairness, feature normalisation, and the privacy that health data demands.": "Classification supervisée sur des données médicales, comparant régression logistique, random forest et XGBoost avec réglage des hyperparamètres et validation croisée. Évaluation par F1 et ROC AUC, avec attention portée à l'équité, à la normalisation et à la confidentialité des données de santé.",
  "A medical chatbot built on a forward chaining inference engine. A knowledge base of IF THEN rules reasons over reported symptoms to narrow toward a probable diagnosis, built on the AIMA framework.": "Chatbot médical fondé sur un moteur d'inférence par chaînage avant. Une base de connaissances composée de règles SI-ALORS raisonne sur les symptômes déclarés pour orienter vers un diagnostic probable, avec le framework AIMA.",
  "Social and community app for ESTIN students: a feed for campus news, events, and discussion, with a shared digital library for course files.": "Application sociale et communautaire pour les étudiants d'ESTIN : fil d'actualités, événements et discussions, avec une bibliothèque numérique partagée pour les supports de cours.",
  "Mobile app for Algerian baccalaureate exam preparation, giving students structured access to past papers and revision material.": "Application mobile de préparation au baccalauréat algérien, offrant aux étudiants un accès structuré aux sujets d'examen et aux supports de révision.",
  "A mobile app and online storefront for a pizzeria, covering the menu, ordering, and the shop front. Freelance work.": "Application mobile et boutique en ligne pour une pizzeria, couvrant le menu, les commandes et la vitrine du commerce. Projet freelance.",
  "Four year engineering programme with a specialization in Artificial Intelligence and Data Science.": "Formation d'ingénieur de quatre ans spécialisée en Intelligence Artificielle et Data Science.",
  "Graduate coursework in machine learning, deep learning, and large scale data processing.": "Cours de niveau master en machine learning, deep learning et traitement de données à grande échelle.",
  "French diploma validation pathway, completed alongside adapting to a new academic system and language.": "Parcours de validation d'un diplôme français, réalisé en parallèle de l'adaptation à un nouveau système universitaire et à une nouvelle langue.",
  "Starting this September. I am looking for an alternance to run alongside it.": "Début en septembre. Je recherche une alternance à effectuer en parallèle.",
  "Remote": "À distance",
};

export function localizeContent(language: Language, value: string): string {
  if (language === "en") return value;
  return CONTENT_TRANSLATIONS[value] ?? value;
}
