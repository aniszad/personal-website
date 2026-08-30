/**
 * Single source of truth for every piece of portfolio content.
 * Components read from here and never hardcode copy, so updating the site
 * means editing this file alone.
 *
 * Image paths are written without a file extension. They are resolved against
 * /public at build time by lib/assets.ts, which picks whichever format is
 * actually on disk and drops the reference entirely when nothing is.
 */

export type Experience = {
  role: string;
  company: string;
  location: string;
  dates: string;
  highlights: readonly string[];
  tags: readonly string[];
  /**
   * Company logo base path, without file extension, resolved against /public
   * at build time. Roles without one render as text alone.
   */
  logo?: string;
};

/** A role with its logo narrowed to a real file, or null. */
export type ResolvedExperience = Omit<Experience, "logo"> & {
  logo: string | null;
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  tags: readonly string[];
  /** Featured projects render as full width cards above the rest of the grid. */
  featured: boolean;
  repo?: string;
  demo?: string;
  /** Set when the source is closed, which suppresses the repository link. */
  proprietary?: boolean;
  /** Present when a long form MDX writeup exists at /projects/[slug]. */
  writeup?: boolean;
};

/**
 * A project with its media attached.
 *
 * Media is found by convention rather than listed here. The resolver looks for
 * /public/images/projects/{slug}-1, -2, -3 in any supported image format and
 * keeps whichever exist, and for a single {slug}-demo video. Adding either
 * means dropping in a correctly named file, with no code change.
 */
export type ResolvedProject = Project & {
  screenshots: readonly string[];
  /** A short demonstration clip, when one is on disk. */
  demoVideo: string | null;
};

export type EducationEntry = {
  dates: string;
  institution: string;
  location: string;
  degree: string;
  description: string;
  /**
   * Logo base path, without file extension, resolved against /public at build
   * time. When it resolves to nothing the entry falls back to an initials badge
   * built from the institution name, so a missing logo never shows a broken
   * image.
   */
  logo?: string;
  /** Institution homepage, shown as a plain right-aligned link. */
  website?: string;
};

/** An education entry with its logo narrowed to a real file, or null. */
export type ResolvedEducationEntry = Omit<EducationEntry, "logo"> & {
  logo: string | null;
};

export type SkillGroup = {
  category: string;
  skills: readonly string[];
};

export const ABOUT_PARAGRAPHS: readonly string[] = [
  "I am a Master's student in Artificial Intelligence at Université de Lille, with an engineering background in AI and Data Science from ESTIN in Algeria. Most of what I enjoy sits where machine learning meets software that real people actually use.",
  "I recently finished a five month development internship at Limpidius, based at EuraTechnologies in Lille. I shipped a browser based barcode scanning library that runs in production at Castorama and other retail clients, handling roughly 3,000 scans a day. Getting GPU image processing and a WASM decoder to cooperate inside a browser tab taught me more about performance than any course did.",
  "I move across the stack comfortably: frontend in Angular and React, backend in NestJS and Spring Boot, mobile in Kotlin, and ML pipelines in Python. I am currently looking for an alternance starting September 2026 in AI, Data Science, or software engineering around Lille.",
];

export const EXPERIENCES: readonly Experience[] = [
  {
    role: "AI Engineer Intern",
    company: "Limpidius",
    location: "EuraTechnologies, Lille",
    dates: "Feb 2026 to Aug 2026",
    logo: "/images/companies/limpidius",
    highlights: [
      "Built a production Angular barcode scanning library using WebGL shaders for GPU image processing, ZBar compiled to WebAssembly, and Web Workers to keep decoding off the main thread.",
      "Deployed to Castorama and other retail clients, where it processes roughly 3,000 scans per day.",
      "Built tenant-stats, a NestJS observability microservice storing scan telemetry in BigQuery and surfacing it through Grafana dashboards.",
    ],
    tags: [
      "Angular",
      "TypeScript",
      "WebGL",
      "WASM",
      "Web Workers",
      "NestJS",
      "BigQuery",
      "Grafana",
      "Kubernetes",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "ETUS",
    location: "Béjaïa, Algeria",
    dates: "Summer 2024 to summer 2025",
    logo: "/images/companies/etus",
    highlights: [
      "Built a bus fleet management system pairing a Spring Boot REST API with a native Android client written in Kotlin.",
      "Implemented real time vehicle tracking, route management, and driver assignment.",
    ],
    tags: ["Spring Boot", "Kotlin", "Android", "REST API", "PostgreSQL"],
  },
  {
    role: "Freelance Developer",
    company: "Independent",
    location: "Remote",
    dates: "Ongoing",
    highlights: [
      "Delivered web and mobile projects for independent clients, covering frontend, backend, and Android work.",
    ],
    tags: ["React", "Angular", "Node.js", "Android"],
  },
];

export const PROJECTS: readonly Project[] = [
  {
    slug: "limpscanner",
    name: "Limpscanner",
    description:
      "Production browser based 1D and 2D barcode scanner. An Angular library using WebGL for GPU image processing, ZBar via WebAssembly, and a multi stage pipeline with region of interest localization. Running at Castorama.",
    tags: ["Angular", "TypeScript", "WebGL", "WASM", "Emscripten", "Web Workers"],
    featured: true,
    proprietary: true,
    writeup: true,
  },
  {
    slug: "timetable-scheduler",
    name: "Timetable Scheduler",
    description:
      "Automatic timetable generation for a university, framed as sequential decision making under hard constraints. A PyTorch policy places one assignment at a time, masked to only the moves the constraints allow, so every schedule it builds is valid by construction. Reinforcement learning then tunes that policy against the quality of the whole timetable rather than any single slot.",
    tags: [
      "Python",
      "PyTorch",
      "Reinforcement Learning",
      "Deep Learning",
      "Optimisation",
    ],
    featured: true,
    repo: "https://github.com/aniszad/Scheduler---Constraint-Satisfaction-Problem",
  },
  {
    slug: "androiddrivepreview",
    name: "AndroidDrivePreview",
    description:
      "Open source Android library published on JitPack for previewing Google Drive files natively, without handing users off to an external app.",
    tags: ["Android", "Kotlin", "JitPack"],
    featured: true,
    repo: "https://github.com/aniszad/AndroidDrivePreview",
  },
  {
    slug: "heart-attack-prediction",
    name: "Heart Attack Prediction",
    description:
      "Supervised classification on medical data, comparing logistic regression, random forest, and XGBoost with hyperparameter tuning and cross validation. Scored on F1 and ROC AUC, with attention to fairness, feature normalisation, and the privacy that health data demands.",
    tags: ["Python", "scikit-learn", "XGBoost", "Classification"],
    featured: false,
  },
  {
    slug: "medical-expert-system",
    name: "Medical Expert System",
    description:
      "A medical chatbot built on a forward chaining inference engine. A knowledge base of IF THEN rules reasons over reported symptoms to narrow toward a probable diagnosis, built on the AIMA framework.",
    tags: ["Python", "Expert System", "Inference Engine", "AIMA"],
    featured: false,
    repo: "https://github.com/aniszad/Medical-Expert-System",
  },
  {
    slug: "estin-connect",
    name: "Estin Connect",
    description:
      "Social and community app for ESTIN students: a feed for campus news, events, and discussion, with a shared digital library for course files.",
    tags: ["Android", "Kotlin", "Firebase"],
    featured: false,
    repo: "https://github.com/aniszad/EstinLib",
  },
  {
    slug: "bacprep",
    name: "BacPrep",
    description:
      "Mobile app for Algerian baccalaureate exam preparation, giving students structured access to past papers and revision material.",
    tags: ["Android", "Kotlin"],
    featured: false,
    repo: "https://github.com/aniszad/BacPrep",
  },
  {
    slug: "lavinia",
    name: "Lavinia",
    description:
      "A mobile app and online storefront for a pizzeria, covering the menu, ordering, and the shop front. Freelance work.",
    tags: ["Kotlin", "Android", "Web"],
    featured: false,
    repo: "https://github.com/aniszad/Lavinia",
  },
];

export const EDUCATION: readonly EducationEntry[] = [
  {
    dates: "2019 to 2023",
    institution: "ESTIN",
    location: "Béjaïa, Algeria",
    degree: "Engineering Cycle in Computer Science",
    description:
      "Four year engineering programme with a specialization in Artificial Intelligence and Data Science.",
    logo: "/images/schools/estin",
    website: "https://www.estin.dz",
  },
  {
    dates: "2023 to 2024",
    institution: "ESTIN",
    location: "Béjaïa, Algeria",
    degree: "Master 1 in AI and Data Science",
    description:
      "Graduate coursework in machine learning, deep learning, and large scale data processing.",
    logo: "/images/schools/estin",
    website: "https://www.estin.dz",
  },
  {
    dates: "2024 to 2025",
    institution: "Université de Lille",
    location: "Lille, France",
    degree: "Licence 3 Informatique",
    description:
      "French diploma validation pathway, completed alongside adapting to a new academic system and language.",
    logo: "/images/schools/univ-lille",
    website: "https://www.univ-lille.fr",
  },
  {
    dates: "2026 to 2027",
    institution: "Université de Lille",
    location: "Lille, France",
    degree: "Master 1 Intelligence Artificielle",
    description:
      "Starting this September. I am looking for an alternance to run alongside it.",
    logo: "/images/schools/univ-lille",
    website: "https://www.univ-lille.fr",
  },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Kotlin", "Java", "C", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["Angular", "React", "Next.js", "Tailwind CSS", "HTML/CSS", "WebGL"],
  },
  {
    category: "Backend",
    skills: ["NestJS", "Node.js", "Spring Boot", "Express"],
  },
  {
    category: "AI and Data",
    skills: ["TensorFlow", "PyTorch", "Pandas", "NumPy", "BigQuery", "Jupyter"],
  },
  {
    category: "Mobile",
    skills: ["Android (Kotlin/Java)", "Jetpack Compose"],
  },
  {
    category: "Cloud and Infrastructure",
    skills: ["GCP", "Kubernetes", "Docker", "Grafana", "GitHub Actions"],
  },
  {
    category: "Tools",
    skills: ["Git", "Linux", "Jira", "Figma", "LaTeX"],
  },
];
