"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Is UniChat free?",
    answer:
      "Yes! UniChat is designed to run entirely on generous free tiers: Google AI Studio Gemini API key, Neon PostgreSQL (pgvector), Upstash Redis, Railway, and Vercel.",
  },
  {
    id: "faq-2",
    question: "Does it store my Slack and Discord messages?",
    answer:
      "Yes, incoming synced messages are stored in the unified native `messages` PostgreSQL table. This allows single-query timeline pagination, cross-platform semantic search, and cited Q&A across all your team's sources.",
  },
  {
    id: "faq-3",
    question: "Can the assistant see channels I haven't joined?",
    answer:
      "No. Security boundaries are strictly enforced. The AI assistant only inspects and cites messages from channels where your user account is an active member.",
  },
  {
    id: "faq-4",
    question: "Which AI model does it use?",
    answer:
      "UniChat uses Google Gemini 2.5 Flash for chat completions, channel summaries, and draft replies, paired with `gemini-embedding-001` (768 dimensions) for vector search.",
  },
  {
    id: "faq-5",
    question: "Do I need a public server for Slack?",
    answer:
      "No. UniChat uses Slack Socket Mode, establishing an outbound WebSocket connection directly from the backend to Slack—no public ingress URL, static IP, or ngrok tunnel required.",
  },
  {
    id: "faq-6",
    question: "Can I add another platform?",
    answer:
      "Yes. The backend uses a clean, modular adapter pattern (`backend/app/features/integrations/adapters/`). Supporting a new service (like Microsoft Teams) requires adding just one new adapter module.",
  },
];

export function Faq() {
  const [openId, setOpenId] = React.useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          Frequently asked questions
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          Everything you need to know about UniChat architecture, privacy, and integrations.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-[14px] bg-surface border border-border shadow-sm overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg font-headline text-ink hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-muted shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-5 pb-5 text-sm sm:text-base text-ink-muted leading-relaxed border-t border-border/50 pt-3 animate-fadeIn"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
