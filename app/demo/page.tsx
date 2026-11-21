export const metadata = {
  title: "Demo — Les Cousines de Léon",
  description: "Client demo: Les Cousines de Léon concept store website.",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", margin: 0, padding: 0, background: "#000" }}>
      <div style={{ padding: "10px 16px", background: "#111", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#aaa", fontSize: 13, fontFamily: "sans-serif" }}>
          Demo — <strong style={{ color: "#fff" }}>Les Cousines de Léon</strong>
        </span>
        <a
          href="/demos/les-cousines-de-leon.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "auto", color: "#aaa", fontSize: 12, fontFamily: "sans-serif", textDecoration: "underline" }}
        >
          Open in full screen ↗
        </a>
      </div>
      <iframe
        src="/demos/les-cousines-de-leon.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Les Cousines de Léon — Demo"
      />
    </div>
  );
}
