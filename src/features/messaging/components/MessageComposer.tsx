"use client";

import React, { useState } from "react";

interface MessageComposerProps {
  onSend: (body: string) => Promise<any>;
  onTyping?: () => void;
  placeholder?: string;
}

export function MessageComposer({
  onSend,
  onTyping,
  placeholder = "Write a message...",
}: MessageComposerProps) {
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await onSend(trimmed);
      setBody("");
    } catch (err: any) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const remainingChars = 4000 - body.length;

  return (
    <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-border)] space-y-2">
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
          className="absolute right-3 bottom-3 p-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
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
