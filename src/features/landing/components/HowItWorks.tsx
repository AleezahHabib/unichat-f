import * as React from "react";
import { UserPlus, Link2, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Create a workspace",
    description: "Launch your UniChat workspace in under 60 seconds. Invite team members with simple, secure invite links.",
    bestFor: "Best for distributed engineering teams needing a single central channel hub.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Link a channel",
    description: "Connect any UniChat channel to Slack or Discord. Messages flow both ways automatically with zero complex setup.",
    bestFor: "Best for bridging open-source Discord communities with internal Slack channels.",
    icon: Link2,
  },
  {
    step: "03",
    title: "Ask anything",
    description: "Ask the AI assistant to summarize discussions, answer questions with exact message citations, or draft context-aware replies.",
    bestFor: "Best for instantly finding past decisions across multiple platforms without search friction.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          How UniChat works
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          Three simple steps to bridge your communication stack and unlock grounded AI intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-6 rounded-[14px] bg-surface border border-border flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded-[6px] bg-primary/10 border border-primary/20">
                    Step {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-[10px] bg-surface-2 flex items-center justify-center text-ink group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold font-headline text-ink">
                  {s.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-medium text-ink-muted flex items-start gap-1.5">
                  <span className="font-bold text-primary shrink-0">Best for:</span>
                  <span>{s.bestFor.replace("Best for ", "")}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
