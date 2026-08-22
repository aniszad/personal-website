export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      aria-label="Loading"
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-bounce rounded-full bg-accent"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
