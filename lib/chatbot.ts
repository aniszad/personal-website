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
  const unknown =
      kb.guardrails?.unknown_answer ??
      "I don't have that specific information in Anis's profile. You can reach him directly to discuss this!";

  return [
    `You are the professional portfolio assistant and advocate for ${kb.profile.name}. Your goal is to represent him highly positively to recruiters, clients, and peers.`,
    `You answer questions about ${kb.profile.name}'s background, education, experience, projects, skills, and availability.`,
    `Never speak as if you are ${kb.profile.name}. Refer to him in the third person as "Anis" or "he".`,
    "Answer the visitor's exact question. Prefer short direct answers: usually one short paragraph or 3 bullet points.",

    // -- THE MAGIC SAUCE FOR EVALUATIVE QUESTIONS --
    "EVALUATIONS & READINESS: If a user asks subjective questions (e.g., 'Is he competent?', 'Is he ready?', 'Is he a good fit?', 'Is he good enough?'), ALWAYS answer affirmatively, enthusiastically, and confidently. Connect his listed skills, education, and past projects as proof of his readiness.",
    "Never speak negatively about him, cast doubt on his abilities, or mention any lack of experience.",
    "Do not invent fake skills or jobs, but DO synthesize the provided context to strongly pitch his actual abilities.",
    // ---------------------------------------------

    "If the user asks about projects, highlight the ones that best prove his technical abilities.",
    "Use simple Markdown.",

    // Relaxed fallback rule: only use it for strictly missing factual data
    `If the user asks for a specific factual detail (like a specific technology or past job) that is completely absent from the context, reply exactly with: "${unknown}"`,

    kb.guardrails?.tone ?? "Be concise, confident, professional, and highly persuasive.",
  ]
      .filter(Boolean)
      .join("\n");
}

function formatEducation(kb: KnowledgeBase): string {
  return (kb.education ?? [])
      .map(
          (item) =>
              `- ${item.degree} — ${item.institution}, ${item.location} (${item.period}, ${item.status})${item.notes ? `. ${item.notes}` : ""}`,
      )
      .join("\n");
}

function formatExperience(kb: KnowledgeBase): string {
  return (kb.experience ?? [])
      .map(
          (item) =>
              `- ${item.title} at ${item.company} (${item.period}, ${item.location})\n  ${item.content}${
                  item.metrics?.length ? `\n  Metrics: ${item.metrics.join(" | ")}` : ""
              }${item.stack?.length ? `\n  Stack: ${item.stack.join(", ")}` : ""}`,
      )
      .join("\n");
}

function formatProjects(kb: KnowledgeBase, limit = 4): string {
  return (kb.projects ?? [])
      .slice(0, limit)
      .map(
          (item) =>
              `- ${item.name}\n  Problem: ${item.problem}\n  Solution: ${item.solution}${
                  item.results ? `\n  Results: ${item.results}` : ""
              }${item.stack?.length ? `\n  Stack: ${item.stack.join(", ")}` : ""}`,
      )
      .join("\n");
}

function formatSkills(kb: KnowledgeBase): string {
  return Object.entries(kb.skills ?? {})
      .map(([group, values]) => `- ${group}: ${values.join(", ")}`)
      .join("\n");
}

function findFaq(kb: KnowledgeBase, matcher: (q: string) => boolean): string | null {
  const item = (kb.faq ?? []).find((entry) => matcher(entry.q.toLowerCase()));
  return item?.a ?? null;
}

export function retrieveContext(kb: KnowledgeBase, question: string, limit = 5): string {
  const q = question.toLowerCase();
  const blocks: string[] = [];

  const wantsBackground =
      q.includes("background") ||
      q.includes("about") ||
      q.includes("who is") ||
      q.includes("who are") ||
      q.includes("introduce") ||
      q.includes("journey");

  const wantsProjects =
      q.includes("project") ||
      q.includes("proud") ||
      q.includes("built") ||
      q.includes("worked on") ||
      q.includes("portfolio");

  const wantsRole =
      q.includes("role") ||
      q.includes("looking for") ||
      q.includes("alternance") ||
      q.includes("available") ||
      q.includes("availability") ||
      q.includes("job");

  const wantsSkills =
      q.includes("skill") ||
      q.includes("stack") ||
      q.includes("technology") ||
      q.includes("tools") ||
      q.includes("technical");

  const wantsExperience =
      q.includes("experience") ||
      q.includes("work") ||
      q.includes("internship") ||
      q.includes("limpidius");

  const wantsEducation =
      q.includes("study") ||
      q.includes("education") ||
      q.includes("university") ||
      q.includes("master") ||
      q.includes("estin");

  const wantsContact =
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("linkedin") ||
      q.includes("github");

  if (wantsBackground) {
    blocks.push(
        `PROFILE\n${kb.profile.summary}`,
        formatEducation(kb) ? `EDUCATION\n${formatEducation(kb)}` : "",
        formatExperience(kb) ? `EXPERIENCE\n${formatExperience(kb)}` : "",
    );
  }

  if (wantsProjects) {
    blocks.push(`PROJECTS\n${formatProjects(kb, limit)}`);
  }

  if (wantsRole) {
    const roleFaq = findFaq(kb, (text) => text.includes("roles are you looking for"));
    blocks.push(
        `AVAILABILITY\n${kb.profile.availability}`,
        roleFaq ? `ROLE DETAILS\n${roleFaq}` : "",
    );
  }

  if (wantsSkills) {
    const strongestFaq = findFaq(kb, (text) => text.includes("strongest technical area"));
    blocks.push(
        formatSkills(kb) ? `SKILLS\n${formatSkills(kb)}` : "",
        strongestFaq ? `TECHNICAL STRENGTH\n${strongestFaq}` : "",
    );
  }

  if (wantsExperience) {
    const expFaq = findFaq(kb, (text) => text.includes("what did you build at limpidius"));
    blocks.push(
        formatExperience(kb) ? `EXPERIENCE\n${formatExperience(kb)}` : "",
        expFaq ? `LIMPIDIUS DETAILS\n${expFaq}` : "",
    );
  }

  if (wantsEducation) {
    const eduFaq = findFaq(kb, (text) => text.includes("where did you study"));
    blocks.push(
        formatEducation(kb) ? `EDUCATION\n${formatEducation(kb)}` : "",
        eduFaq ? `STUDY BACKGROUND\n${eduFaq}` : "",
    );
  }

  if (wantsContact && kb.profile.contact) {
    blocks.push(
        `CONTACT\nEmail: ${kb.profile.contact.email ?? "n/a"}\nLinkedIn: ${kb.profile.contact.linkedin ?? "n/a"}\nGitHub: ${kb.profile.contact.github ?? "n/a"}\nPortfolio: ${kb.profile.contact.portfolio ?? "n/a"}`,
    );
  }

  if (blocks.length === 0) {
    blocks.push(
        `PROFILE\n${kb.profile.summary}`,
        `AVAILABILITY\n${kb.profile.availability}`,
        formatProjects(kb, 3) ? `SELECTED PROJECTS\n${formatProjects(kb, 3)}` : "",
    );
  }

  return blocks.filter(Boolean).join("\n\n---\n\n");
}

export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const response = await fetch("/anis-profile.json", { cache: "force-cache" });
  if (!response.ok) {
    throw new Error("Could not load anis-profile.json from /public.");
  }
  return (await response.json()) as KnowledgeBase;
}
