import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { HeroBackground } from "@/features/landing/components/HeroBackground";
import { ShieldCheck, Database, Cpu, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About UniChat | Unified Team Chat & Grounded AI Intelligence",
  description:
    "Learn about UniChat's mission to bridge fragmented team channels across Slack, Discord, and native chat with grounded Gemini AI intelligence.",
};

const PILLARS = [
  {
    icon: Database,
    title: "Unified Data Strategy",
    description:
      "All conversational events—UniChat native messages, Slack events, and Discord webhooks—live in a single unified messages table. This guarantees single-query timeline pagination and single-vector-table semantic search.",
  },
  {
    icon: ShieldCheck,
    title: "Strict Membership Security",
    description:
      "Your privacy is non-negotiable. The Gemini AI assistant strictly enforces channel membership security boundaries: it only reads and cites messages from channels where you are an active member.",
  },
  {
    icon: Cpu,
    title: "Free-Tier Native",
    description:
      "Designed from day one to operate cleanly on free infrastructure tiers: Google AI Studio Gemini API key, Neon PostgreSQL, Upstash Redis, Railway, and Vercel. Zero mandatory paid SaaS subscriptions.",
  },
  {
    icon: Zap,
    title: "Containerless Simplicity",
    description:
      "No Docker required for development or deployment. Built with Python 3.11+ FastAPI and Next.js 15 App Router for lightning-fast bare metal or serverless deployment.",
  },
];

const STACK = [
  { name: "Next.js 15", category: "Frontend Framework", detail: "App Router + React 19 + Strict TypeScript" },
  { name: "Tailwind CSS v4", category: "Design System", detail: "Custom Skyline tokens & dark mode" },
  { name: "FastAPI", category: "Backend Engine", detail: "Python 3.11 + Pydantic v2 + Uvicorn" },
  { name: "Neon PostgreSQL", category: "Database & Vectors", detail: "pgvector HNSW index + asyncpg" },
  { name: "Upstash Redis", category: "Realtime Pub/Sub", detail: "Presence tracking + rate limiting + leader lock" },
  { name: "Google Gemini", category: "AI & Embeddings", detail: "Gemini 2.5 Flash + gemini-embedding-001" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* About Hero Header */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
          <HeroBackground />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
            <span>About UniChat</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-headline text-ink leading-tight mb-6">
            Bridging fragmented team communications.
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted max-w-3xl mx-auto leading-relaxed">
            Modern hybrid engineering teams find themselves fractured across Slack workspaces, Discord communities, and internal chat tools. UniChat acts as the unified conversational hub.
          </p>
        </section>

        {/* Mission & Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-ink">
                Chat. Connect. Ask.
              </h2>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                When developers work in Slack, open-source contributors chat in Discord, and internal discussion happens in team chat, context gets lost. Search requires checking multiple apps, and decisions disappear into separate silos.
              </p>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                UniChat links these worlds together. A UniChat channel can be connected 1:1 to a Slack channel and a Discord channel so messages flow both ways automatically. An AI assistant powered by Google Gemini summarizes discussions, answers questions with cited source messages, and drafts replies.
              </p>
            </div>

            <div className="p-6 rounded-[18px] bg-surface border border-border shadow-sm space-y-4 font-mono text-xs text-ink">
              <div className="flex items-center justify-between pb-3 border-b border-border text-ink-muted">
                <span className="font-bold">UniChat Tagline</span>
                <span className="text-primary font-bold">Three Core Pillars</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-[10px] bg-surface-2 border border-border">
                  <span className="font-bold text-primary block mb-1">1. Unified Team Chat (Chat)</span>
                  Workspaces, invite links, public channels, and full message lifecycle with threads.
                </div>
                <div className="p-3 rounded-[10px] bg-surface-2 border border-border">
                  <span className="font-bold text-live block mb-1">2. Two-Way Sync (Connect)</span>
                  Bidirectional relay to Slack Socket Mode and Discord Webhooks with echo prevention.
                </div>
                <div className="p-3 rounded-[10px] bg-surface-2 border border-border">
                  <span className="font-bold text-ai block mb-1">3. Grounded Intelligence (Ask)</span>
                  Cited Q&amp;A, channel recaps, draft replies, and 768-dim vector semantic search.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Architectural Pillars Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold font-headline text-ink">
              Architectural Design Principles
            </h2>
            <p className="text-base text-ink-muted">
              Built spec-first with strict separation of concerns, containerless simplicity, and zero vendor lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-6 rounded-[16px] bg-surface border border-border shadow-sm space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-headline text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technology Stack Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold font-headline text-ink">
              The Technology Stack
            </h2>
            <p className="text-base text-ink-muted">
              Modern, performant, and completely free of paid API dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STACK.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-[14px] bg-surface border border-border shadow-sm space-y-2"
              >
                <span className="text-xs font-mono font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold font-headline text-ink">{item.name}</h3>
                <p className="text-xs text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-border">
          <div className="p-8 sm:p-12 rounded-[20px] bg-gradient-to-r from-sky-top/40 via-primary/10 to-sky-top/40 border border-primary/20 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-ink">
              Ready to unify your team&apos;s channels?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 text-sm font-semibold text-white bg-primary hover:opacity-95 rounded-[10px] shadow-sm transition-all"
              >
                Create a workspace
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 text-sm font-semibold text-ink bg-surface hover:bg-surface-2 border border-border rounded-[10px] transition-colors flex items-center gap-1.5"
              >
                <span>Read the engineering blog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
