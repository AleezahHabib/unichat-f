import * as React from "react";
import { Zap, MessageSquareText, ShieldCheck, Search, FileText, PenTool } from "lucide-react";

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          Engineered for real-time team collaboration
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          A unified hub where instant team chat seamlessly integrates with your existing Discord and Slack communities.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Tile (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 p-8 rounded-[18px] bg-surface border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-[12px] bg-live/10 border border-live/30 flex items-center justify-center text-live">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-headline text-ink">
              Sub-second live message delivery & presence
            </h3>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
              Messages stream instantly across all clients with typing indicators and live online presence, so you always know who's around and what they're doing.
            </p>
          </div>

          <div className="p-4 rounded-[14px] bg-surface-2 border border-border font-mono text-xs text-ink space-y-2">
            <div className="flex items-center justify-between text-ink-muted">
              <span>Instant delivery</span>
              <span className="text-live font-bold">&lt; 150ms</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-live w-[92%]" />
            </div>
          </div>
        </div>

        {/* Medium Tile 1: Deep Threads */}
        <div className="p-6 rounded-[18px] bg-surface border border-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-headline text-ink">
              Deep thread discussions
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Keep main channels clean and focused. Thread discussions stay organized and connected across team channels.
            </p>
          </div>

          <div className="p-3 rounded-[10px] bg-surface-2 border border-border text-xs text-ink flex items-center justify-between">
            <span>Thread reply count</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              14 replies
            </span>
          </div>
        </div>

        {/* Medium Tile 2: Platform Badges & Multi-Relay */}
        <div className="p-6 rounded-[18px] bg-surface border border-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-surface-2 border border-border flex items-center justify-center text-ink">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-headline text-ink">
              Messages never duplicate
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Linked channels stay in sync without echo loops or duplicated posts. Clear badges always show where every message originated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-[6px] bg-[#4A154B] text-white text-xs font-bold">
              Slack
            </span>
            <span className="px-2.5 py-1 rounded-[6px] bg-[#5865F2] text-white text-xs font-bold">
              Discord
            </span>
            <span className="text-xs text-ink-muted font-mono ml-auto">
              Sync: Active
            </span>
          </div>
        </div>

        {/* Small Tile 1 (AI): Semantic Vector Search */}
        <div className="p-6 rounded-[18px] bg-ai/5 border border-ai/20 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-ai/10 border border-ai/30 flex items-center justify-center text-ai">
                <Search className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-ai/10 border border-ai/30 text-[10px] font-semibold text-ai">
                Coming soon
              </span>
            </div>
            <h3 className="text-lg font-bold font-headline text-ink">
              Search by meaning
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Find what you&apos;re looking for by concept and context across FistaChat, Slack, and Discord—even without exact keyword matches.
            </p>
          </div>
        </div>

        {/* Small Tile 2 (AI): Structured Summaries */}
        <div className="p-6 rounded-[18px] bg-ai/5 border border-ai/20 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-ai/10 border border-ai/30 flex items-center justify-center text-ai">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-ai/10 border border-ai/30 text-[10px] font-semibold text-ai">
                Coming soon
              </span>
            </div>
            <h3 className="text-lg font-bold font-headline text-ink">
              Channel recaps
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Catch up in seconds with clear, structured summaries of key points, decisions, and open questions—always backed by source messages.
            </p>
          </div>
        </div>

        {/* Small Tile 3 (AI): Contextual Draft Replies */}
        <div className="p-6 rounded-[18px] bg-ai/5 border border-ai/20 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-ai/10 border border-ai/30 flex items-center justify-center text-ai">
                <PenTool className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-ai/10 border border-ai/30 text-[10px] font-semibold text-ai">
                Coming soon
              </span>
            </div>
            <h3 className="text-lg font-bold font-headline text-ink">
              Draft replies
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Context-aware response suggestions generated right in your composer for you to review and edit before sending.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
