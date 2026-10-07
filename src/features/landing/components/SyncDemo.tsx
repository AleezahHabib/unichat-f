"use client";

import * as React from "react";
import { TabId } from "./HeroTabs";
import { Sparkles, Hash, ArrowUpRight } from "lucide-react";

interface SyncDemoProps {
  activeTab: TabId;
}

export function SyncDemo({ activeTab }: SyncDemoProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto rounded-[18px] bg-surface border border-border shadow-2xl overflow-hidden transition-all duration-300"
      id={`hero-panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`hero-tab-${activeTab}`}
    >
      {/* Product Window Top Chrome */}
      <div className="px-4 py-3 bg-surface-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-live/80" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-[8px] bg-surface border border-border text-xs font-mono text-ink-muted">
          <Hash className="w-3.5 h-3.5 text-primary" />
          <span>unichat.app / workspace / #general</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
          <span className="text-xs font-medium text-ink-muted hidden sm:inline">
            Live Sync Active
          </span>
        </div>
      </div>

      {/* Product Frame Body Content */}
      <div className="p-4 sm:p-6 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between bg-bg/50">
        {activeTab === "chat" && <ChatMockup />}
        {activeTab === "connect" && (
          <ConnectMockup reducedMotion={reducedMotion} isVisible={isVisible} />
        )}
        {activeTab === "ask" && <AskMockup />}
      </div>
    </div>
  );
}

{/* Tab 1: Chat View Mockup */}
function ChatMockup() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full py-2">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/30">
          AR
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">Alex Rivera</span>
            <span className="text-xs text-ink-muted">10:42 AM</span>
          </div>
          <div className="p-3 rounded-[12px] rounded-tl-none bg-surface border border-border text-sm text-ink max-w-lg shadow-sm">
            Hey team, are we ready for the v2 release cycle? All tests passing?
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-live/20 text-live font-bold flex items-center justify-center text-sm shrink-0 border border-live/30">
          SC
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">Sarah Chen</span>
            <span className="text-xs text-ink-muted">10:43 AM</span>
          </div>
          <div className="p-3 rounded-[12px] rounded-tl-none bg-surface border border-border text-sm text-ink max-w-lg shadow-sm">
            Just finished checking the release candidate! Everything looks clean and all systems are go.
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/30">
          AR
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">Alex Rivera</span>
            <span className="text-xs text-ink-muted">10:44 AM</span>
          </div>
          <div className="p-3 rounded-[12px] rounded-tl-none bg-surface border border-border text-sm text-ink max-w-lg shadow-sm">
            Awesome work. I will notify engineering and prepare the release docs.
          </div>
        </div>
      </div>

      {/* Typing Indicator */}
      <div className="pt-2 flex items-center gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-2 border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
          <span className="ml-1 font-medium text-ink">Sarah Chen is typing...</span>
        </div>
      </div>
    </div>
  );
}

{/* Tab 2: Connect Animated Sync Mockup */}
function ConnectMockup({
  reducedMotion,
  isVisible,
}: {
  reducedMotion: boolean;
  isVisible: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full py-2">
      {/* FistaChat Window Left */}
      <div className="rounded-[14px] bg-surface border border-border p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-semibold text-xs text-ink">FistaChat Workspace</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-live/10 text-live text-[10px] font-bold">
              Hub Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-[10px] bg-surface-2 border border-border text-xs text-ink">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-primary">Alice</span>
                <span className="text-[10px] text-ink-muted">Outbound</span>
              </div>
              Deploying v2.5 to production now.
            </div>

            {/* Inbound reply from Slack */}
            <div className="p-3 rounded-[10px] bg-surface-2 border border-live/30 text-xs text-ink relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#4A154B] text-white">
                    Slack
                  </span>
                  <span className="font-bold text-ink">Dave Miller</span>
                </div>
                <span className="text-[10px] text-live font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-ping" />
                  Synced
                </span>
              </div>
              Received on Slack! Synced in real time.
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
          <span>Relay: 2 active channel links</span>
          <span className="text-live font-medium">Live sync active</span>
        </div>
      </div>

      {/* Generic External Panes Right */}
      <div className="space-y-3 flex flex-col justify-between">
        {/* Generic Slack Pane */}
        <div className="rounded-[14px] bg-surface border border-border p-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A154B]" />
              <span className="font-bold text-xs text-ink">Slack Channel</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#4A154B] text-white text-[10px] font-semibold">
              Live Sync
            </span>
          </div>
          <div className="p-2.5 rounded-[8px] bg-surface-2 text-xs text-ink">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink">Alice (via FistaChat)</span>
              <span className="text-[10px] text-ink-muted">Just now</span>
            </div>
            Deploying v2.5 to production now.
          </div>
        </div>

        {/* Generic Discord Pane */}
        <div className="rounded-[14px] bg-surface border border-border p-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2]" />
              <span className="font-bold text-xs text-ink">Discord Channel</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#5865F2] text-white text-[10px] font-semibold">
              Live Sync
            </span>
          </div>
          <div className="p-2.5 rounded-[8px] bg-surface-2 text-xs text-ink">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink">Alice (via FistaChat)</span>
              <span className="text-[10px] text-ink-muted">Just now</span>
            </div>
            Deploying v2.5 to production now.
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Tab 3: Ask View Mockup */}
function AskMockup() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full py-2">
      {/* User Query */}
      <div className="flex items-start gap-3 justify-end">
        <div className="p-3.5 rounded-[14px] rounded-tr-none bg-primary text-white text-sm max-w-lg shadow-sm">
          What did we decide about the launch date?
        </div>
      </div>

      {/* Assistant Answer */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-ai/20 text-ai font-bold flex items-center justify-center text-sm shrink-0 border border-ai/30">
          <Sparkles className="w-5 h-5 text-ai" />
        </div>
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ai">FistaChat Assistant</span>
            <span className="px-2 py-0.5 rounded-full bg-ai/10 text-ai text-[10px] font-bold border border-ai/20">
              Gemini 2.5 Flash
            </span>
          </div>

          <div className="p-4 rounded-[14px] rounded-tl-none bg-surface border border-ai/30 text-sm text-ink space-y-3 shadow-md">
            <p>
              The team finalized the launch date for <strong>October 12th at 09:00 UTC</strong>. All documentation and release milestones have been completed.
            </p>

            {/* Cited source chips */}
            <div className="pt-2 border-t border-border">
              <span className="text-xs font-semibold text-ink-muted block mb-2">
                Cited Source Messages:
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#assistant"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-ai/10 border border-ai/30 text-xs font-mono font-medium text-ai hover:bg-ai/20 transition-colors"
                >
                  <Hash className="w-3 h-3 text-ai" />
                  <span>#general : 104</span>
                  <ArrowUpRight className="w-3 h-3 text-ai" />
                </a>

                <a
                  href="#assistant"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-ai/10 border border-ai/30 text-xs font-mono font-medium text-ai hover:bg-ai/20 transition-colors"
                >
                  <Hash className="w-3 h-3 text-ai" />
                  <span>#launches : 42</span>
                  <ArrowUpRight className="w-3 h-3 text-ai" />
                </a>

                <a
                  href="#assistant"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#4A154B]/10 border border-[#4A154B]/30 text-xs font-mono font-medium text-ink hover:bg-[#4A154B]/20 transition-colors"
                >
                  <span className="px-1 rounded text-[9px] font-bold bg-[#4A154B] text-white">
                    Slack
                  </span>
                  <span>#announcements</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
