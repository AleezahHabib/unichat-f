"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { SummaryPanel } from "./SummaryPanel";

interface SummaryButtonProps {
  channelId: string;
  channelName: string;
  workspaceId: string;
}

export function SummaryButton({ channelId, channelName, workspaceId }: SummaryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Summarize channel messages with AI"
        className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-ai)] hover:text-white text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-ai)] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)] group-hover:text-white" />
        <span>Summary</span>
      </button>

      <SummaryPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        channelId={channelId}
        channelName={channelName}
        workspaceId={workspaceId}
      />
    </>
  );
}
