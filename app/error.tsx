"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-accent">500</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-heading">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error occurred. Try refreshing the page or going back.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-surface"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:border-accent/50 hover:text-heading"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
