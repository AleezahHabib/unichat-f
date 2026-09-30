"use client";

import * as React from "react";
import Link from "next/link";
import { AnnouncementPill } from "./AnnouncementPill";
import { HeroTabs, TabId } from "./HeroTabs";
import { SyncDemo } from "./SyncDemo";
import { HeroBackground } from "./HeroBackground";

const TABS: TabId[] = ["chat", "connect", "ask"];

const SUBLINES: Record<TabId, string> = {
  chat: "Workspaces, channels and threads, with messages that arrive the moment they're sent.",
  connect: "Link a channel to Slack or Discord. Messages flow both ways, automatically.",
  ask: "Summaries, answers and drafts from an assistant that shows you exactly where each answer came from.",
};

export function Hero() {
  const [activeTab, setActiveTab] = React.useState<TabId>("chat");
  const [userHasInteracted, setUserHasInteracted] = React.useState(false);

  // Auto advance ~9s until user interacts
  React.useEffect(() => {
    if (userHasInteracted) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (TABS.indexOf(prev) + 1) % TABS.length;
        return TABS[nextIdx];
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [userHasInteracted]);

  return (
    <section className="relative pt-4 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Layered Floating Cloud Sky Background */}
      <HeroBackground />

      {/* Announcement Pill */}
      <AnnouncementPill />

      {/* Main Headline & Responsive Subline */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* H1 Headline: All 3 words stay rendered for zero layout shift; active word emphasized */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-headline leading-[1.1] flex items-center justify-center gap-2 sm:gap-4 flex-wrap select-none">
          {/* Word 1: Chat. */}
          <span className="relative inline-block pb-1">
            <span
              className={`transition-all duration-300 ${
                activeTab === "chat"
                  ? "opacity-100 text-ink scale-[1.03]"
                  : "opacity-35 text-ink-muted"
              }`}
            >
              Chat.
            </span>
            {activeTab === "chat" && (
              <span className="absolute bottom-0 left-0 w-full h-1.5 rounded-full bg-primary transition-all duration-300" />
            )}
          </span>

          {/* Word 2: Connect. */}
          <span className="relative inline-block pb-1">
            <span
              className={`transition-all duration-300 ${
                activeTab === "connect"
                  ? "opacity-100 text-ink scale-[1.03]"
                  : "opacity-35 text-ink-muted"
              }`}
            >
              Connect.
            </span>
            {activeTab === "connect" && (
              <span className="absolute bottom-0 left-0 w-full h-1.5 rounded-full bg-live transition-all duration-300" />
            )}
          </span>

          {/* Word 3: Ask. */}
          <span className="relative inline-block pb-1">
            <span
              className={`transition-all duration-300 ${
                activeTab === "ask"
                  ? "opacity-100 text-ink scale-[1.03]"
                  : "opacity-35 text-ink-muted"
              }`}
            >
              Ask.
            </span>
            {activeTab === "ask" && (
              <span className="absolute bottom-0 left-0 w-full h-1.5 rounded-full bg-ai transition-all duration-300" />
            )}
          </span>
        </h1>

        {/* Subline: Space reserved (min-h-[4.5rem] / sm:min-h-[3.5rem]) to prevent layout jumping */}
        <div className="min-h-[4.5rem] sm:min-h-[3.5rem] flex items-center justify-center max-w-2xl mx-auto px-2">
          <p
            key={activeTab}
            className="text-lg sm:text-xl text-ink-muted leading-relaxed animate-sublineSwap"
          >
            {SUBLINES[activeTab]}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white bg-primary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-[10px] shadow-lg transition-all"
          >
            Create a free workspace
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-ink bg-surface hover:bg-surface-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px] shadow-sm transition-all"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Interactive Tabs Control */}
      <div className="mt-12 mb-6">
        <HeroTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userHasInteracted={userHasInteracted}
          setUserHasInteracted={setUserHasInteracted}
        />
      </div>

      {/* Product View Frame */}
      <SyncDemo activeTab={activeTab} />
    </section>
  );
}
