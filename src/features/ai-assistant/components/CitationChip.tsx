"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Citation } from "../api";
import { PlatformBadge } from "@/features/integrations/components/PlatformBadge";
import { Hash, ExternalLink } from "lucide-react";

interface CitationChipProps {
  citation: Citation;
  workspaceId: string;
  onJump?: (citation: Citation) => void;
}

export function CitationChip({ citation, workspaceId, onJump }: CitationChipProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onJump) {
      onJump(citation);
      return;
    }

    if (citation.channel_id) {
      router.push(`/workspace/${workspaceId}/channel/${citation.channel_id}?messageId=${citation.message_id}`);
    } else {
      // Fallback: search or go to channel by name
      router.push(`/workspace/${workspaceId}/search?q=${encodeURIComponent(citation.snippet.slice(0, 30))}`);
    }
  };

  const isNative = !citation.source || citation.source.toLowerCase() === "unichat";

  return (
    <button
      onClick={handleClick}
      title={`Jump to message by ${citation.author_name}: "${citation.snippet}"`}
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-ai)] hover:bg-[var(--color-ai)]/5 text-[var(--color-ink)] transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]"
    >
      {/* Platform Badge or Channel icon */}
      {isNative ? (
        <span className="flex items-center text-[var(--color-ai)] font-semibold text-[11px]">
          <Hash className="w-3 h-3 mr-0.5 opacity-70" />
          {citation.channel_name}
        </span>
      ) : (
        <div className="flex items-center gap-1">
          <PlatformBadge platform={citation.source} />
          <span className="text-[11px] font-semibold text-[var(--color-ink-muted)]">
            #{citation.channel_name}
          </span>
        </div>
      )}

      {/* Author Byline */}
      <span className="text-[var(--color-ink-muted)] text-[11px] max-w-[100px] truncate">
        • {citation.author_name}
      </span>

      {/* Jump icon indicator */}
      <ExternalLink className="w-2.5 h-2.5 text-[var(--color-ai)] opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 shrink-0" />
    </button>
  );
}
