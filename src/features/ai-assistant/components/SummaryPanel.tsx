"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { summarizeChannel, SummarizeResponse, Citation } from "../api";
import { CitationChip } from "./CitationChip";
import {
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ApiError } from "@/lib/api-client";

interface SummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  workspaceId: string;
}

const TIME_RANGES = [
  { label: "Last 24 Hours", hours: 24 },
  { label: "Last 3 Days", hours: 72 },
  { label: "Last 7 Days", hours: 168 },
];

export function SummaryPanel({
  isOpen,
  onClose,
  channelId,
  channelName,
  workspaceId,
}: SummaryPanelProps) {
  const router = useRouter();
  const [sinceHours, setSinceHours] = useState(24);
  const [summaryData, setSummaryData] = useState<SummarizeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiDisabled, setAiDisabled] = useState(false);
  const [busyCountdown, setBusyCountdown] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSummary = async (hours: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    setAiDisabled(false);
    try {
      const data = await summarizeChannel(channelId, hours);
      setSummaryData(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.code === "ai_disabled") {
          setAiDisabled(true);
        } else if (err.code === "ai_busy") {
          const waitTime = err.retryAfter || 15;
          setBusyCountdown(waitTime);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg(err?.message || "Failed to generate channel summary");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary(sinceHours);
    } else {
      setSummaryData(null);
      setErrorMsg(null);
      setAiDisabled(false);
      setBusyCountdown(null);
    }
  }, [isOpen, channelId, sinceHours]);

  // Busy countdown timer
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

  if (!isOpen) return null;

  const handleJump = (citation: Citation) => {
    onClose();
    const targetChannelId = citation.channel_id || channelId;
    router.push(`/workspace/${workspaceId}/channel/${targetChannelId}?messageId=${citation.message_id}`);
  };

  const keyPoints = summaryData?.key_points?.length ? summaryData.key_points : summaryData?.action_items || [];
  const decisions = summaryData?.decisions?.length ? summaryData.decisions : summaryData?.key_decisions || [];
  const openQuestions = summaryData?.open_questions || [];
  const allCitations = summaryData?.citations || [];

  const getItemCitations = (itemText: string, index: number): Citation[] => {
    if (allCitations.length === 0) return [];
    const matched = allCitations.filter((c) => {
      const words = c.snippet.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      return words.some((w) => itemText.toLowerCase().includes(w));
    });
    if (matched.length > 0) return matched;
    const assignedIndex = index % allCitations.length;
    return [allCitations[assignedIndex]];
  };

  const timeLabel = TIME_RANGES.find((t) => t.hours === sinceHours)?.label || "Last 24 Hours";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--color-surface)] border-l border-[var(--color-border)] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 bg-[var(--color-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-ai)]/10 text-[var(--color-ai)] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[var(--color-ink)] flex items-center gap-2">
                <span>Channel Summary</span>
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                #{channelName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close summary panel"
            className="p-2 rounded-xl text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Filter Bar */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/50 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
            <Clock className="w-3.5 h-3.5" />
            <span>Timeframe:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {TIME_RANGES.map((t) => (
              <button
                key={t.hours}
                onClick={() => setSinceHours(t.hours)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                  sinceHours === t.hours
                    ? "bg-[var(--color-ai)] text-white shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] border border-[var(--color-border)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* AI Disabled Notice */}
          {aiDisabled && (
            <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-ink)]">
                <Sparkles className="w-4 h-4 text-[var(--color-ai)]" />
                <span>AI features are unavailable</span>
              </div>
              <p className="leading-relaxed">
                AI assistant features are currently disabled in this workspace or GEMINI_API_KEY is not configured.
              </p>
            </div>
          )}

          {/* AI Busy Countdown Notice */}
          {busyCountdown !== null && busyCountdown > 0 && (
            <div className="p-4 rounded-xl bg-[var(--color-ai)]/10 border border-[var(--color-ai)]/25 text-xs text-[var(--color-ink)] space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2 text-[var(--color-ai)]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI assistant is busy</span>
                </span>
                <span className="font-mono font-bold text-[var(--color-ai)] px-2 py-0.5 rounded bg-[var(--color-ai)]/15">
                  {busyCountdown}s
                </span>
              </div>
              <p className="text-[var(--color-ink-muted)] leading-relaxed">
                Gemini rate limit reached (free tier). We will be able to process your request in {busyCountdown} seconds.
              </p>
              <button
                onClick={() => fetchSummary(sinceHours)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Retry now
              </button>
            </div>
          )}

          {/* Loading state with explicit action narrative */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center px-4">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-ai)]/10 text-[var(--color-ai)] flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  Generating Channel Summary
                </p>
                <p className="text-xs text-[var(--color-ink-muted)] max-w-xs leading-relaxed">
                  Scanning #{channelName} messages across {timeLabel.toLowerCase()} and extracting key points, decisions, and open questions with source citations...
                </p>
              </div>

              <div className="w-36 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[var(--color-ai)] rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          ) : errorMsg ? (
            <div className="p-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-xs text-[var(--color-danger)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : summaryData ? (
            <div className="space-y-6">
              {/* Overview Synopsis */}
              {summaryData.summary && (
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] leading-relaxed">
                  {summaryData.summary}
                </div>
              )}

              {/* Section 1: Key Points */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)]" />
                  <span>Key Points ({keyPoints.length})</span>
                </h3>
                {keyPoints.length > 0 ? (
                  <ul className="space-y-2.5">
                    {keyPoints.map((pt, i) => {
                      const itemCitations = getItemCitations(pt, i);
                      return (
                        <li
                          key={i}
                          className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] leading-relaxed space-y-2 shadow-xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-[var(--color-ai)] font-bold shrink-0 mt-0.5">•</span>
                            <span className="flex-1">{pt}</span>
                          </div>
                          {itemCitations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1 pl-3.5">
                              {itemCitations.map((c, ci) => (
                                <CitationChip
                                  key={`${c.message_id}_${ci}`}
                                  citation={c}
                                  workspaceId={workspaceId}
                                  onJump={handleJump}
                                />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No major points detected in this timeframe.</p>
                )}
              </div>

              {/* Section 2: Decisions */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Decisions ({decisions.length})</span>
                </h3>
                {decisions.length > 0 ? (
                  <ul className="space-y-2.5">
                    {decisions.map((dec, i) => {
                      const itemCitations = getItemCitations(dec, i + 5);
                      return (
                        <li
                          key={i}
                          className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-[var(--color-ink)] leading-relaxed space-y-2 shadow-xs"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="flex-1">{dec}</span>
                          </div>
                          {itemCitations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1 pl-5">
                              {itemCitations.map((c, ci) => (
                                <CitationChip
                                  key={`${c.message_id}_${ci}`}
                                  citation={c}
                                  workspaceId={workspaceId}
                                  onJump={handleJump}
                                />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No explicit decisions recorded in this timeframe.</p>
                )}
              </div>

              {/* Section 3: Open Questions */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open Questions ({openQuestions.length})</span>
                </h3>
                {openQuestions.length > 0 ? (
                  <ul className="space-y-2.5">
                    {openQuestions.map((q, i) => {
                      const itemCitations = getItemCitations(q, i + 10);
                      return (
                        <li
                          key={i}
                          className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[var(--color-ink)] leading-relaxed space-y-2 shadow-xs"
                        >
                          <div className="flex items-start gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="flex-1">{q}</span>
                          </div>
                          {itemCitations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1 pl-5">
                              {itemCitations.map((c, ci) => (
                                <CitationChip
                                  key={`${c.message_id}_${ci}`}
                                  citation={c}
                                  workspaceId={workspaceId}
                                  onJump={handleJump}
                                />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No unresolved questions detected in this timeframe.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
