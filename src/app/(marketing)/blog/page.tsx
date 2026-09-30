import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { HeroBackground } from "@/features/landing/components/HeroBackground";
import { BookOpen, Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | UniChat Engineering & Architecture",
  description:
    "Engineering deep dives into two-way Slack/Discord sync, pgvector RAG citations, single-table architecture, and containerless performance.",
};

interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  featured?: boolean;
}

const POSTS: BlogPost[] = [
  {
    id: "single-table-architecture",
    title: "Why We Store Native, Slack, and Discord Messages in a Single Postgres Table",
    category: "Architecture",
    readTime: "8 min read",
    date: "Sep 24, 2026",
    excerpt:
      "By modeling all conversational events in a single unified messages table with partial indexes, search, vector embeddings, and RAG Q&A work seamlessly across platforms without extra join overhead.",
    featured: true,
  },
  {
    id: "zero-echo-sync",
    title: "Zero-Echo Sync: Multi-Layer Deduplication Across Slack & Discord",
    category: "Integrations",
    readTime: "6 min read",
    date: "Sep 20, 2026",
    excerpt:
      "How we prevent infinite message rebroadcast loops using Fernet-encrypted tokens, partial unique indexes, and echo guards across Slack Socket Mode and Discord Webhooks.",
  },
  {
    id: "gemini-pgvector-rag",
    title: "Grounded Q&A with Gemini 2.5 Flash & pgvector HNSW Indexing",
    category: "AI & Vector",
    readTime: "7 min read",
    date: "Sep 15, 2026",
    excerpt:
      "How UniChat converts raw chat messages into 768-dimensional embeddings and uses HNSW cosine similarity to cite exact source message IDs in AI responses.",
  },
  {
    id: "free-tier-engineering",
    title: "Free Tier Engineering: Running UniChat for $0/month",
    category: "Architecture",
    readTime: "5 min read",
    date: "Sep 10, 2026",
    excerpt:
      "Architecting a high-performance production stack on Neon Postgres, Upstash Redis, Google AI Studio, Railway, and Vercel free tiers without hitting command caps.",
  },
  {
    id: "containerless-simplicity",
    title: "Containerless Simplicity: Why We Avoided Docker in Development",
    category: "Engineering",
    readTime: "4 min read",
    date: "Sep 05, 2026",
    excerpt:
      "Using native Python 3.11 virtualenvs and Node 20 npm scripts for seamless cross-platform local development on Windows, macOS, and Linux.",
  },
  {
    id: "realtime-redis-leader",
    title: "Low-Latency WebSockets with Upstash Redis Pub/Sub & Leader Locking",
    category: "Realtime",
    readTime: "6 min read",
    date: "Aug 28, 2026",
    excerpt:
      "How single-leader Redis locking manages Slack Socket Mode background workers while multi-replica FastAPI nodes deliver sub-second WebSocket updates to connected browsers.",
  },
];

export default function BlogPage() {
  const featuredPost = POSTS.find((p) => p.featured) || POSTS[0];
  const gridPosts = POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Blog Hero Header */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
          <HeroBackground />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai/10 border border-ai/20 text-xs font-semibold text-ai mb-6">
            <BookOpen className="w-4 h-4 text-ai" />
            <span>Engineering Blog</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-headline text-ink leading-tight mb-6">
            UniChat Insights &amp; Architecture
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted max-w-3xl mx-auto leading-relaxed">
            Technical deep dives into real-time WebSockets, two-way sync protocols, vector RAG search, and containerless engineering.
          </p>
        </section>

        {/* Featured Post Banner */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-[24px] bg-surface border border-border shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-center hover:border-primary/40 transition-all">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                  Featured Article
                </span>
                <span className="text-ink-muted">•</span>
                <span className="text-ink-muted">{featuredPost.category}</span>
                <span className="text-ink-muted">•</span>
                <span className="text-ink-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-ink leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                <span>Read full technical deep dive</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="p-6 rounded-[16px] bg-surface-2 border border-border space-y-3 font-mono text-xs text-ink">
              <div className="flex items-center justify-between text-ink-muted pb-2 border-b border-border">
                <span>Architecture Diagram</span>
                <span className="text-live font-bold">Single Table</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border text-[11px] space-y-1">
                <span className="text-primary font-bold">messages</span>
                <p className="text-ink-muted">id, channel_id, author_id, body, source (unichat|slack|discord), external_id</p>
              </div>
              <div className="text-[10px] text-ink-muted flex items-center justify-between">
                <span>Index: HNSW cosine ops</span>
                <span>Dim: 768</span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Post Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold font-headline text-ink">Latest Engineering Posts</h3>
            <span className="text-xs font-mono text-ink-muted">Showing {POSTS.length} articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-[18px] bg-surface border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
                    <span className="px-2.5 py-0.5 rounded bg-surface-2 font-semibold text-ink">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold font-headline text-ink group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>

                  <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read post</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-border">
          <div className="p-8 sm:p-12 rounded-[20px] bg-ai/5 border border-ai/20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai/10 text-ai text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-ai" />
              <span>Stay Updated</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-ink">
              Want more deep dives on realtime architecture?
            </h2>

            <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto">
              UniChat is built spec-first with zero docker dependencies. Check out our open specifications and start building.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 text-sm font-semibold text-white bg-primary hover:opacity-95 rounded-[10px] shadow-sm transition-all"
              >
                Create a free workspace
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 text-sm font-semibold text-ink bg-surface hover:bg-surface-2 border border-border rounded-[10px] transition-colors"
              >
                Learn about the team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
