import * as React from "react";
import Link from "next/link";
import { UniChatLogo } from "@/components/ui/UniChatLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Terms of Service | UniChat",
  description: "Terms of service and acceptable usage policies for the UniChat application.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 font-headline font-bold text-lg text-ink hover:opacity-90 transition-opacity">
            <UniChatLogo className="w-7 h-7" />
            <span>UniChat</span>
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
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-headline text-ink mt-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-ink-muted mt-2">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-ink/90">
            {/* Section 1 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">1. Acceptance of Terms</h2>
              <p>
                By accessing or using UniChat (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or organization, you represent that you have the authority to bind such entity.
              </p>
            </section>

            {/* Section 2 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">2. Service Description</h2>
              <p>
                UniChat is a unified workspace collaboration platform that enables real-time messaging, bidirectional cross-platform synchronization with Slack and Discord, and AI-assisted workspace intelligence powered by Google Gemini.
              </p>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">3. Acceptable Use Policy</h2>
              <p>You agree not to use UniChat to:</p>
              <ul className="list-disc list-inside space-y-2 text-ink-muted">
                <li>Transmit unlawful, abusive, defamatory, or harmful content.</li>
                <li>Attempt to bypass rate limits, authentication barriers, or security controls.</li>
                <li>Distribute malicious software, spam, or automated denial-of-service traffic.</li>
                <li>Interfere with third-party service policies (including Slack and Discord terms of service).</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">4. Third-Party Integrations</h2>
              <p>
                UniChat connects to external services including Slack and Discord via their respective APIs and Socket Mode protocols. Your use of those platforms is also governed by their respective terms of service. UniChat is not affiliated with or endorsed by Slack Technologies, LLC or Discord Inc.
              </p>
            </section>

            {/* Section 5 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">5. Disclaimer of Warranties &amp; Limitation of Liability</h2>
              <p>
                The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. UniChat does not guarantee uninterrupted or error-free operation. In no event shall UniChat or its developers be liable for indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">6. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the Service following published updates constitutes acceptance of the modified Terms of Service.
              </p>
            </section>

            {/* Section 7 */}
            <section className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <h2 className="text-lg font-bold font-headline text-ink">7. Contact Information</h2>
              <p>
                For any questions regarding these Terms, contact us at <a href="mailto:unichatapp.support@gmail.com" className="text-primary hover:underline font-medium">unichatapp.support@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 px-4 text-center text-xs text-ink-muted">
        &copy; {new Date().getFullYear()} UniChat. All rights reserved. Built with Next.js, FastAPI, PostgreSQL, and Gemini.
      </footer>
    </div>
  );
}
