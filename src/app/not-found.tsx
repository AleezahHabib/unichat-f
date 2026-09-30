import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--color-bg)]">
      <h1 className="text-6xl font-extrabold text-[var(--color-primary)] font-[var(--font-headline)]">
        404
      </h1>
      <h2 className="text-xl font-bold text-[var(--color-ink)] mt-3">
        Page Not Found
      </h2>
      <p className="text-sm text-[var(--color-ink-muted)] mt-1 max-w-sm">
        The channel, workspace, or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/workspaces"
        className="mt-6 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity"
      >
        Return to Workspaces
      </Link>
    </div>
  );
}
