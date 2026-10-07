import * as React from "react";
import Link from "next/link";
import { FistaChatLogo } from "@/components/ui/FistaChatLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Privacy Policy | FistaChat",
  description: "Learn how FistaChat handles and protects your workspace communications, tokens, and AI data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 font-headline font-bold text-lg text-ink hover:opacity-90 transition-opacity">
            <FistaChatLogo className="w-7 h-7" />
            <span>FistaChat</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="space-y-8">
          <div>
            <span className="text-xs font-mono font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              Legal &amp; Privacy
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-headline text-ink mt-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-ink-muted mt-2">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-ink/90">
            {/* Section 1 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">1. Overview &amp; Commitment</h2>
              <p>
                FistaChat is dedicated to protecting the privacy and security of your team communications. This Privacy Policy explains how information is collected, stored, encrypted, processed, and safeguarded when using our unified chat service, connected platform integrations (Slack, Discord), and AI assistance tools.
              </p>
            </section>

            {/* Section 2 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">2. Data We Collect &amp; Store</h2>
              <ul className="list-disc list-inside space-y-2 text-ink-muted">
                <li>
                  <strong className="text-ink">Account Credentials:</strong> Name, email address, and cryptographically hashed passwords (via bcrypt).
                </li>
                <li>
                  <strong className="text-ink">Workspace &amp; Channel Data:</strong> Workspace names, channel names, membership rosters, and team settings stored in Neon PostgreSQL.
                </li>
                <li>
                  <strong className="text-ink">Messages:</strong> Message text, timestamps, author identifiers, parent-child thread references, and origin metadata (FistaChat, Slack, or Discord).
                </li>
                <li>
                  <strong className="text-ink">Integration Tokens:</strong> Slack Bot tokens, App-level tokens, Discord bot tokens, and incoming webhook URLs. These are <strong className="text-ink">strictly encrypted at rest</strong> using AES-256 / Fernet encryption.
                </li>
                <li>
                  <strong className="text-ink">Ephemeral Session Data:</strong> Live user presence, typing indicators, and rate-limiting counters stored temporarily in Upstash Redis.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">3. AI Processing &amp; Gemini Integration</h2>
              <p>
                FistaChat utilizes Google Gemini API models to provide on-demand semantic search, channel summarization, and draft reply generation.
              </p>
              <ul className="list-disc list-inside space-y-2 text-ink-muted">
                <li>
                  <strong className="text-ink">No Model Training:</strong> Your messages and team discussions are processed solely for generating real-time responses and vector embeddings. Data sent to Google Gemini is <strong className="text-ink">never</strong> used to train foundational AI models.
                </li>
                <li>
                  <strong className="text-ink">Vector Embeddings:</strong> High-dimensional embeddings (768-dim) are stored securely in Neon PostgreSQL with pgvector for fast semantic lookup within your workspace.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">4. Third-Party Integrations (Slack &amp; Discord)</h2>
              <p>
                When you connect a Slack workspace or Discord server to FistaChat:
              </p>
              <ul className="list-disc list-inside space-y-2 text-ink-muted">
                <li>
                  Tokens granted via Slack OAuth or manual bot setup are used strictly to relay messages between linked channels and read authorized channel metadata.
                </li>
                <li>
                  We do not read or process private DMs or channels that have not been explicitly linked to a FistaChat channel.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">5. Data Deletion &amp; User Control</h2>
              <p>
                Workspace owners maintain full control over their integrations and data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-ink-muted">
                <li>
                  <strong className="text-ink">Disconnecting Platforms:</strong> Disconnecting a Slack or Discord integration instantly deletes all stored access tokens and webhook records from the database and shuts down active background listeners.
                </li>
                <li>
                  <strong className="text-ink">Account &amp; Workspace Removal:</strong> To request complete removal of your account or workspace data, contact our support team at <a href="mailto:unichatapp.support@gmail.com" className="text-primary hover:underline font-medium">unichatapp.support@gmail.com</a>.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">6. Contact &amp; Inquiries</h2>
              <p>
                If you have questions regarding this Privacy Policy or our security practices, please contact us at:
              </p>
              <p className="text-ink font-mono text-xs">
                Email: unichatapp.support@gmail.com<br />
                Security team: unichatapp.support@gmail.com
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 px-4 text-center text-xs text-ink-muted">
        &copy; {new Date().getFullYear()} FistaChat. All rights reserved. Built with Next.js, FastAPI, PostgreSQL, and Gemini.
      </footer>
    </div>
  );
}
