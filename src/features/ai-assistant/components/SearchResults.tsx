"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SearchResult } from "../api";
import { PlatformBadge } from "@/features/integrations/components/PlatformBadge";
import { Hash, Sparkles, Search, MessageSquare, Clock, ArrowRight } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  workspaceId: string;
  query: string;
  isLoading: boolean;
  hasSearched: boolean;
}

export function SearchResults({
  results,
  workspaceId,
  query,
  isLoading,
  hasSearched,
}: SearchResultsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 rounded-full border-3 border-[var(--color-ai)] border-t-transparent animate-spin" />
        <p className="text-xs text-[var(--color-ink-muted)]">Searching across messages with AI embeddings...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-ai)]/10 text-[var(--color-ai)] flex items-center justify-center shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-[var(--color-ink)] font-[var(--font-headline)]">
            Semantic & Keyword Search
          </h3>
          <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            Search messages across UniChat, Slack, and Discord. Try natural questions or phrases like{" "}
            <span className="font-semibold text-[var(--color-ink)]">&ldquo;launch timeline&rdquo;</span> or{" "}
            <span className="font-semibold text-[var(--color-ink)]">&ldquo;refund bug discussions&rdquo;</span>.
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-[var(--color-ink)]">No messages found</h3>
          <p className="text-xs text-[var(--color-ink-muted)]">
            No messages matched &ldquo;{query}&rdquo; in your joined channels.
          </p>
        </div>
      </div>
    );
  }

  const handleSelectResult = (r: SearchResult) => {
    router.push(`/workspace/${workspaceId}/channel/${r.channel_id}?messageId=${r.message_id}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)] px-1">
        <span>
          Found {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
        </span>
      </div>

      <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-xs">
        {results.map((r) => {
          const dateStr = new Date(r.created_at).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const isNative = !r.source || r.source.toLowerCase() === "unichat";

          return (
            <div
              key={r.message_id}
              onClick={() => handleSelectResult(r)}
              className="group p-4 hover:bg-[var(--color-surface-2)]/60 transition cursor-pointer flex flex-col gap-2"
            >
              {/* Header: Channel, Author, Platform, Semantic Indicator, Timestamp */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {/* Channel Tag */}
                  <span className="inline-flex items-center gap-1 font-semibold text-xs text-[var(--color-ink)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                    <Hash className="w-3 h-3 text-[var(--color-ink-muted)]" />
                    {r.channel_name}
                  </span>

                  {/* Author */}
                  <span className="text-xs font-semibold text-[var(--color-ink)]">{r.author_name}</span>

                  {/* Platform Badge */}
                  {!isNative && <PlatformBadge platform={r.source} showVia />}
                </div>

                <div className="flex items-center gap-2">
                  {/* Match Type Badge */}
                  {r.is_semantic ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-ai)]/10 text-[var(--color-ai)] border border-[var(--color-ai)]/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      Semantic match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                      Keyword match
                    </span>
                  )}

                  {/* Timestamp */}
                  <span className="flex items-center gap-1 text-[11px] text-[var(--color-ink-muted)]">
                    <Clock className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <p className="text-sm text-[var(--color-ink)] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                {r.body}
              </p>

              {/* Jump link on hover */}
              <div className="flex items-center justify-end text-xs text-[var(--color-primary)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center gap-1">
                  Jump to message <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
