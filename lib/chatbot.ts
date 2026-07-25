export type KnowledgeBase = {
  profile: {
    name: string;
    role: string;
    location: string;
    summary: string;
    availability: string;
    contact?: {
      email?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
  };
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    status: string;
    notes?: string;
  }>;
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    period: string;
    content: string;
    stack?: string[];
    tags?: string[];
    metrics?: string[];
  }>;
  projects?: Array<{
    id: string;
    name: string;
    problem: string;
    solution: string;
    stack?: string[];
    results?: string;
  }>;
  skills?: Record<string, string[]>;
  faq?: Array<{ q: string; a: string }>;
  guardrails?: {
    identity?: string;
    scope?: string;
    unknown_answer?: string;
    tone?: string;
    privacy?: string;
    redirect_to_contact?: string;
  };
};

type Chunk = {
  id: string;
  text: string;
};

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "what",
  "when",
  "where",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function buildChunks(kb: KnowledgeBase): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: "profile",
    text: [
      `Name: ${kb.profile.name}`,
      `Role: ${kb.profile.role}`,
      `Location: ${kb.profile.location}`,
      `Summary: ${kb.profile.summary}`,
      `Availability: ${kb.profile.availability}`,
    ].join("\n"),
  });

  if (kb.profile.contact) {
    chunks.push({
      id: "contact",
      text: `Contact: email=${kb.profile.contact.email ?? "n/a"}, linkedin=${kb.profile.contact.linkedin ?? "n/a"}, github=${kb.profile.contact.github ?? "n/a"}, portfolio=${kb.profile.contact.portfolio ?? "n/a"}`,
    });
  }

  for (const item of kb.education ?? []) {
    chunks.push({
      id: `education-${item.id}`,
      text: `Education: ${item.degree} at ${item.institution} in ${item.location} (${item.period}, ${item.status}). ${item.notes ?? ""}`,
    });
  }

  for (const item of kb.experience ?? []) {
    chunks.push({
      id: `experience-${item.id}`,
      text: `Experience: ${item.title} at ${item.company} in ${item.location} (${item.period}). ${item.content} Stack: ${(item.stack ?? []).join(", ")}. Metrics: ${(item.metrics ?? []).join(" | ")}`,
    });
  }

  for (const item of kb.projects ?? []) {
    chunks.push({
      id: `project-${item.id}`,
      text: `Project ${item.name}. Problem: ${item.problem}. Solution: ${item.solution}. Stack: ${(item.stack ?? []).join(", ")}. Results: ${item.results ?? ""}`,
    });
  }

  for (const [group, values] of Object.entries(kb.skills ?? {})) {
    chunks.push({
      id: `skills-${group}`,
      text: `Skills (${group}): ${values.join(", ")}`,
    });
  }

  for (const [index, item] of (kb.faq ?? []).entries()) {
    chunks.push({
      id: `faq-${index}`,
      text: `Question: ${item.q}\nAnswer: ${item.a}`,
    });
  }

  return chunks;
}

export function retrieveContext(kb: KnowledgeBase, question: string, limit = 5): string {
  const terms = tokenize(question);
  if (terms.length === 0) {
    return "";
  }

  const ranked = buildChunks(kb)
    .map((chunk) => {
      const haystack = chunk.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) {
          score += 1;
        }
      }
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk.text);

  return ranked.join("\n\n---\n\n");
}

export function findBestFaqAnswer(
  kb: KnowledgeBase,
  question: string,
): string | null {
  const terms = tokenize(question);
  if (terms.length === 0 || !kb.faq || kb.faq.length === 0) {
    return null;
  }

  const best = kb.faq
    .map((item) => {
      const haystack = `${item.q} ${item.a}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) {
          score += 1;
        }
      }
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)[0];

  return best && best.score > 1 ? best.item.a : null;
}

export function buildRuleBasedFallbackAnswer(
  kb: KnowledgeBase,
  question: string,
): string {
  const lower = question.toLowerCase();
  const fromFaq = findBestFaqAnswer(kb, question);
  if (fromFaq) {
    return fromFaq;
  }

  if (
    lower.includes("background") ||
    lower.includes("about") ||
    lower.includes("who are you")
  ) {
    return kb.profile.summary;
  }

  if (
    lower.includes("role") ||
    lower.includes("looking for") ||
    lower.includes("alternance")
  ) {
    return kb.profile.availability;
  }

  if (
    lower.includes("contact") ||
    lower.includes("email") ||
    lower.includes("linkedin")
  ) {
    const email = kb.profile.contact?.email;
    const linkedin = kb.profile.contact?.linkedin;
    return `You can contact Anis at ${email ?? "email unavailable"}${
      linkedin ? ` or on LinkedIn: ${linkedin}` : "."
    }`;
  }

  if (lower.includes("project")) {
    const top = (kb.projects ?? [])
      .slice(0, 3)
      .map((project) => project.name)
      .join(", ");
    if (top) {
      return `Some key projects are: ${top}. Ask me about one and I can give details.`;
    }
  }

  if (lower.includes("experience") || lower.includes("work")) {
    const first = kb.experience?.[0];
    if (first) {
      return `${first.title} at ${first.company} (${first.period}): ${first.content}`;
    }
  }

  if (lower.includes("skill") || lower.includes("stack")) {
    const languages = kb.skills?.languages?.slice(0, 6).join(", ");
    const backend = kb.skills?.backend?.slice(0, 4).join(", ");
    return `Core skills include ${languages ?? "TypeScript, Python"}${backend ? `, plus backend with ${backend}` : ""}.`;
  }

  const email = kb.profile.contact?.email;
  const linkedin = kb.profile.contact?.linkedin;
  const contact = email
    ? ` You can reach Anis at ${email}${
        linkedin ? ` or on LinkedIn: ${linkedin}` : "."
      }`
    : "";
  return `I don't have that specific information in Anis's profile.${contact}`;
}

export function buildSystemPrompt(kb: KnowledgeBase): string {
  return [
    kb.guardrails?.identity ??
      `You are an AI assistant on ${kb.profile.name}'s portfolio website.`,
    kb.guardrails?.scope ??
      "Only answer questions about the candidate's profile, education, experience, projects, skills, and availability.",
    kb.guardrails?.tone ??
      "Be concise, specific, and professional. Avoid hype and fluff.",
    kb.guardrails?.privacy ??
      "Only use information explicitly present in the provided context.",
    "If asked about your identity or implementation, clearly say you are powered by an open-source packaged model and not built from scratch.",
    `If a question cannot be answered from context, reply exactly with: "${kb.guardrails?.unknown_answer ?? "I don't have that information in this profile."}"`,
    kb.guardrails?.redirect_to_contact ?? "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const response = await fetch("/anis-profile.json", { cache: "force-cache" });
  if (!response.ok) {
    throw new Error("Could not load anis-profile.json from /public.");
  }
  return (await response.json()) as KnowledgeBase;
}
