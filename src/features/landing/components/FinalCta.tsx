import * as React from "react";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[24px] bg-gradient-to-r from-sky-top/50 via-primary/10 to-sky-top/50 border border-primary/20 p-10 sm:p-16 text-center space-y-8 shadow-xl relative overflow-hidden">
        {/* Glow atmosphere background */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none" />

        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-headline text-ink leading-tight">
            Bring every conversation home.
          </h2>
          <p className="text-base sm:text-lg text-ink-muted">
            Unify your team&apos;s channels, link Slack and Discord, and get grounded AI answers in minutes.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-primary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-[10px] shadow-lg transition-all"
          >
            Create your free workspace
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-ink bg-surface hover:bg-surface-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px] shadow-sm transition-all"
          >
            Sign in to existing workspace
          </Link>
        </div>
      </div>
    </section>
  );
}
