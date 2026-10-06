import * as React from "react";
import Link from "next/link";
import { UniChatLogo } from "@/components/ui/UniChatLogo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Logo & Tagline */}
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <UniChatLogo className="w-7 h-7" />
            <span className="font-headline font-bold text-lg text-ink">UniChat</span>
          </Link>
          <p className="text-xs text-ink-muted">
            Unified team chat with Slack &amp; Discord sync and Gemini AI intelligence.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-ink-muted">
          <Link href="/#features" className="hover:text-ink transition-colors">
            Features
          </Link>
          <Link href="/#integrations" className="hover:text-ink transition-colors">
            Integrations
          </Link>
          <Link href="/#assistant" className="hover:text-ink transition-colors">
            AI Assistant
          </Link>
          <Link href="/#faq" className="hover:text-ink transition-colors">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:text-ink transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-ink transition-colors">
            Terms of Service
          </Link>
          <a href="mailto:unichatapp.support@gmail.com" className="hover:text-ink transition-colors">
            Support
          </a>
          <Link href="/login" className="hover:text-ink transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-ink transition-colors">
            Sign up
          </Link>
        </div>

        {/* Technology stack attribution */}
        <div className="text-xs text-ink-muted font-mono">
          Built with Next.js, FastAPI, PostgreSQL, Redis and Gemini.
        </div>
      </div>
    </footer>
  );
}
