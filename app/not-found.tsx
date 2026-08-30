import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-7xl text-heading">404</p>
      <h1 className="mt-4 font-serif text-2xl text-heading">
        Page not found
      </h1>
      <p className="mt-4 max-w-md font-light text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 border-b border-heading pb-1 text-sm font-medium text-heading"
      >
        Back to home
      </Link>
    </div>
  );
}
