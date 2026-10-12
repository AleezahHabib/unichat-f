"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface DraftReplyButtonProps {
  messageId: string;
  onDraftClick: (messageId: string) => void;
  isDrafting?: boolean;
}

export function DraftReplyButton({
  messageId,
  onDraftClick,
  isDrafting = false,
}: DraftReplyButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDrafting) return;
    onDraftClick(messageId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDrafting}
      title={isDrafting ? "Generating draft reply..." : "Draft reply with AI"}
      aria-label="Draft reply with AI"
      className="p-1.5 hover:text-[var(--color-ai)] hover:bg-[var(--color-ai)]/10 text-[var(--color-ai)] rounded-lg transition text-xs flex items-center justify-center cursor-pointer disabled:opacity-60"
    >
      {isDrafting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-ai)]" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)]" />
      )}
    </button>
  );
}
