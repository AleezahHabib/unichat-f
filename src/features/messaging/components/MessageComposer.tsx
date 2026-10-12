"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, X, Send } from "lucide-react";

interface AiNotice {
  code: string;
  message: string;
  retryAfter?: number;
}

interface MessageComposerProps {
  onSend: (body: string) => Promise<any>;
  onTyping?: () => void;
  placeholder?: string;
  draftValue?: string;
  onClearDraft?: () => void;
  isGeneratingDraft?: boolean;
  onCancelDrafting?: () => void;
  aiNotice?: AiNotice | null;
  onDismissNotice?: () => void;
}

export function MessageComposer({
  onSend,
  onTyping,
  placeholder = "Write a message...",
  draftValue,
  onClearDraft,
  isGeneratingDraft = false,
  onCancelDrafting,
  aiNotice,
  onDismissNotice,
}: MessageComposerProps) {
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [busyCountdown, setBusyCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (draftValue) {
      setBody(draftValue);
      setIsAiDraft(true);
    }
  }, [draftValue]);

  // Busy countdown timer
  useEffect(() => {
    if (aiNotice?.code === "ai_busy") {
      setBusyCountdown(aiNotice.retryAfter || 15);
    } else {
      setBusyCountdown(null);
    }
  }, [aiNotice]);

  useEffect(() => {
    if (busyCountdown === null || busyCountdown <= 0) return;
    const interval = setInterval(() => {
      setBusyCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [busyCountdown]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    if (onTyping && e.target.value.trim().length > 0) {
      onTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDiscardDraft = () => {
    setBody("");
    setIsAiDraft(false);
    if (onClearDraft) onClearDraft();
  };

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await onSend(trimmed);
      setBody("");
      setIsAiDraft(false);
      if (onClearDraft) onClearDraft();
    } catch (err: any) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const remainingChars = 4000 - body.length;

  return (
    <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-border)] space-y-2">
      {/* 1. Generating Draft state with dismiss button */}
      {isGeneratingDraft && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--color-ai)]/10 border border-[var(--color-ai)]/30 text-xs text-[var(--color-ai)] font-medium animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-ai)]" />
            <span>Drafting reply with AI assistant...</span>
          </div>
          {onCancelDrafting && (
            <button
              type="button"
              onClick={onCancelDrafting}
              className="text-[11px] font-semibold hover:underline cursor-pointer opacity-80 hover:opacity-100 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Dismiss
            </button>
          )}
        </div>
      )}

      {/* 2. AI Notice: ai_disabled or ai_busy countdown */}
      {aiNotice && !isGeneratingDraft && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)] shrink-0" />
            <span>
              {aiNotice.code === "ai_disabled"
                ? "AI features are disabled on this instance."
                : busyCountdown !== null && busyCountdown > 0
                ? `AI is busy (free tier limit). Ready in ${busyCountdown}s.`
                : "AI is ready again."}
            </span>
          </div>
          {onDismissNotice && (
            <button
              type="button"
              onClick={onDismissNotice}
              aria-label="Dismiss notice"
              className="p-1 hover:text-[var(--color-ink)] rounded transition cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* 3. AI Drafted Reply Banner: Makes it obvious the draft is NOT sent */}
      {isAiDraft && !isGeneratingDraft && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--color-ai)]/10 border border-[var(--color-ai)]/30 text-xs text-[var(--color-ai)] font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)] shrink-0" />
            <span>
              <strong>AI Drafted Reply</strong> — Not sent yet. Review or edit before sending.
            </span>
          </div>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="text-[11px] font-semibold hover:underline cursor-pointer opacity-80 hover:opacity-100 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Discard
          </button>
        </div>
      )}

      {/* Textarea Composer */}
      <div className="relative">
        <textarea
          value={body}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={4000}
          rows={2}
          placeholder={placeholder}
          className="w-full p-3 pr-12 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />
        <button
          onClick={handleSubmit}
          disabled={isSending || !body.trim()}
          title="Send message"
          className="absolute right-3 bottom-3 p-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 transition shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {body.length > 3500 && (
        <div className="text-right text-[10px] font-mono text-[var(--color-ink-muted)]">
          {remainingChars} characters remaining
        </div>
      )}
    </div>
  );
}
