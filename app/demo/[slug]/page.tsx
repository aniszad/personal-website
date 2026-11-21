import { notFound } from "next/navigation";

/**
 * Demo registry — add a new entry for each client demo.
 * key   : the URL slug  → /demo/<key>
 * file  : HTML filename in /public/demos/
 * label : shown in the top bar
 */
const DEMOS: Record<string, { file: string; label: string }> = {
  "les-cousines-de-leon": {
    file: "les-cousines-de-leon.html",
    label: "Les Cousines de Léon",
  },
  // Add more demos here:
  // "another-client": { file: "another-client.html", label: "Another Client" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMOS[slug];
  if (!demo) return {};
  return {
    title: `Demo — ${demo.label}`,
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMOS[slug];
  if (!demo) notFound();

  const src = `/demos/${demo.file}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", margin: 0, padding: 0, background: "#000" }}>
      <div style={{ padding: "10px 16px", background: "#111", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#aaa", fontSize: 13, fontFamily: "sans-serif" }}>
          Demo — <strong style={{ color: "#fff" }}>{demo.label}</strong>
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "auto", color: "#aaa", fontSize: 12, fontFamily: "sans-serif", textDecoration: "underline" }}
        >
          Open in full screen ↗
        </a>
      </div>
      <iframe
        src={src}
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title={`${demo.label} — Demo`}
      />
    </div>
  );
}
