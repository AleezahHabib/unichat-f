import * as React from "react";
import { Sparkles, Shield, ArrowUpRight, Hash } from "lucide-react";

export function AssistantShowcase() {
  return (
    <section id="assistant" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[24px] bg-ai/5 border border-ai/20 p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Copy Left */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai/10 border border-ai/30 text-xs font-semibold text-ai">
              <Sparkles className="w-4 h-4 text-ai" />
              <span>Grounded Intelligence</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-ai/10 border border-ai/30 text-[11px] font-semibold text-ai">
              Coming soon
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink leading-tight">
            Ask your channels anything. Get answers backed by exact source citations.
          </h2>

          <p className="text-base text-ink-muted leading-relaxed">
            The assistant has read everything the team said across FistaChat, Slack, and Discord, and every answer shows the exact messages it came from with direct clickable links.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-ink-muted border-t border-ai/20">
            <Shield className="w-4 h-4 text-ai shrink-0" />
            <span>It only reads channels you&apos;ve joined. Private conversations stay private.</span>
          </div>
        </div>

        {/* Static Cited Conversation Right */}
        <div className="p-6 rounded-[18px] bg-surface border border-ai/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="font-bold text-sm text-ink">FistaChat Assistant</span>
            </div>
            <span className="text-xs font-mono text-ai">Google Gemini 2.5 Flash</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-[10px] bg-surface-2 text-xs text-ink">
              <span className="font-bold text-primary block mb-1">User Question</span>
              What were the final test database requirements agreed upon?
            </div>

            <div className="p-4 rounded-[12px] bg-surface-2 border border-ai/20 text-xs text-ink space-y-3">
              <p className="leading-relaxed">
                The test database MUST use Neon PostgreSQL with a database name ending in <strong>_test</strong> to prevent safety check failures during pytest runs.
              </p>

              <div className="pt-2 border-t border-border">
                <span className="text-[11px] font-semibold text-ink-muted block mb-1.5">
                  Source Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ai/10 text-ai font-mono text-[11px]">
                    <Hash className="w-3 h-3" />
                    #dev-backend : 88
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#4A154B]/10 text-ink font-mono text-[11px]">
                    <span className="px-1 rounded bg-[#4A154B] text-white text-[9px] font-bold">
                      Slack
                    </span>
                    #architecture
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
