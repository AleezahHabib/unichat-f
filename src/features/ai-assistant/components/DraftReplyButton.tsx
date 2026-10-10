"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { draftReply } from "../api";
import { ApiError } from "@/lib/api-client";

interface DraftReplyButtonProps {
  messageId: string;
  onDraftReady: (draftText: string) => void;
  onError?: (msg: string) => void;
}

export function DraftReplyButton({ messageId, onDraftReady, onError }: DraftReplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDraft = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await draftReply(messageId);
      if (res && res.draft) {
        onDraftReady(res.draft);
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Failed to draft reply";
      if (onError) onError(msg);
      else console.error("Draft reply error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDraft}
      disabled={isLoading}
      title="Draft an AI response to this message"
      className="p-1 hover:text-[var(--color-ai)] hover:bg-[var(--color-ai)]/10 rounded transition text-xs flex items-center gap-1 cursor-pointer"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-ai)]" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)]" />
      )}
    </button>
  );
}
