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
        className="px-3 py-1.5 rounded-xl bg-[var(--color-ai)]/10 hover:bg-[var(--color-ai)] text-[var(--color-ai)] hover:text-white border border-[var(--color-ai)]/30 hover:border-{var(--color-ai)] text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5" />
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
