"use client";

import * as React from "react";
import { MessageSquare, RefreshCw, Sparkles } from "lucide-react";

export type TabId = "chat" | "connect" | "ask";

interface HeroTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  userHasInteracted: boolean;
  setUserHasInteracted: (val: boolean) => void;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "chat", label: "Chat Mode", icon: MessageSquare },
  { id: "connect", label: "Connect Mode", icon: RefreshCw },
  { id: "ask", label: "Ask Mode", icon: Sparkles },
];

export function HeroTabs({
  activeTab,
  onTabChange,
  setUserHasInteracted,
}: HeroTabsProps) {
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = TABS.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = TABS[nextIndex].id;
    setUserHasInteracted(true);
    onTabChange(nextTab);
    tabsRef.current[nextIndex]?.focus();
  };

  const handleSelect = (tabId: TabId) => {
    setUserHasInteracted(true);
    onTabChange(tabId);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Main Segmented Tab Bar with Sliding Active Background */}
      <div
        role="tablist"
        aria-label="Product views"
        className="relative inline-flex items-center p-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-lg gap-1"
      >
        {/* Animated Sliding Pill Highlight */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-surface border border-border shadow-md transition-all duration-300 ease-out z-0"
          style={{
            width: `calc((100% - 12px) / ${TABS.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`,
          }}
        />

        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[idx] = el;
              }}
              role="tab"
              id={`hero-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`hero-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative z-10 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 select-none ${
                isActive
                  ? "text-ink scale-[1.02]"
                  : "text-ink-muted hover:text-ink hover:opacity-90"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive
                    ? tab.id === "ask"
                      ? "text-ai scale-110"
                      : tab.id === "connect"
                      ? "text-live scale-110"
                      : "text-primary scale-110"
                    : "text-ink-muted"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
