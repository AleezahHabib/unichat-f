"use client";

import React, { useState, useEffect } from "react";
import { summarizeChannel, SummarizeResponse } from "../api";
import { CitationChip } from "./CitationChip";
import { X, Sparkles, CheckCircle2, HelpCircle, ListFilter, Clock, ShieldAlert, AlertCircle } from "lucide-react";
import { ApiError } from "@/lib/api-client";

interface SummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  workspaceId: string;
}

export function SummaryPanel({
  isOpen,
  onClose,
  channelId,
  channelName,
  workspaceId,
}: SummaryPanelProps) {
  const [sinceHours, setSinceHours] = useState(24);
  const [summaryData, setSummaryData] = useState<SummarizeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiDisabled, setAiDisabled] = useState(false);
  const [busyCountdown, setBusyCountdown] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSummary = async (hours: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await summarizeChannel(channelId, hours);
      setSummaryData(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.code === "ai_disabled") {
          setAiDisabled(true);
        } else if (err.code === "ai_busy") {
          setBusyCountdown(err.retryAfter || 15);
        } else {
          setErrorMsg(err.message || "Failed to generate summary");
        }
      } else {
        setErrorMsg(err?.message || "Error generating channel summary");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary(sinceHours);
    }
  }, [isOpen, channelId]);

  // Countdown timer for ai_busy
  useEffect(() => {
    if (busyCountdown === null || busyCountdown <= 0) return;
    const timer = setInterval(() => {
      setBusyCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [busyCountdown]);

  if (!isOpen) return null;

  const keyPoints = summaryData?.key_points || [];
  const decisions = summaryData?.decisions || summaryData?.key_decisions || [];
  const openQuestions = summaryData?.open_questions || summaryData?.action_items || [];
  const citations = summaryData?.citations || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border-l border-[var(--color-border)] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Panel Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-ai)]/15 text-[var(--color-ai)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[var(--color-ink)] font-[var(--font-headline)] flex items-center gap-2">
                <span>Channel Summary</span>
                <span className="text-xs font-normal text-[var(--color-ink-muted)]">
                  #{channelName}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Time window:</span>
          </span>

          <div className="flex items-center gap-1">
            {[
              { label: "24h", hours: 24 },
              { label: "3 days", hours: 72 },
              { label: "7 days", hours: 168 },
            ].map((option) => (
              <button
                key={option.hours}
                onClick={() => {
                  setSinceHours(option.hours);
                  fetchSummary(option.hours);
                }}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sinceHours === option.hours
                    ? "bg-[var(--color-ai)] text-white shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] border border-[var(--color-border)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {aiDisabled && (
            <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)] flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-semibold text-[var(--color-ink)]">AI Summary Offline</div>
                <div>The AI assistant is disabled in this environment.</div>
              </div>
            </div>
          )}

          {busyCountdown !== null && (
            <div className="p-4 rounded-xl bg-[var(--color-ai)]/10 border border-[var(--color-ai)]/30 text-xs text-[var(--color-ai)] flex items-center gap-2 animate-pulse">
              <Clock className="w-4 h-4 shrink-0" />
              <div>
                AI service is busy. Ready again in{" "}
                <span className="font-bold font-mono">{busyCountdown}s</span>...
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 rounded-full border-2 border-[var(--color-ai)] border-t-transparent animate-spin" />
              <p className="text-xs text-[var(--color-ink-muted)]">
                Analyzing recent #{channelName} messages with Gemini...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-xs text-[var(--color-danger)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : summaryData ? (
            <div className="space-y-6">
              {/* Overall Summary Notice */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] leading-relaxed">
                {summaryData.summary}
              </div>

              {/* 1. Key Points */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)]" />
                  <span>Key Points ({keyPoints.length})</span>
                </h3>
                {keyPoints.length > 0 ? (
                  <ul className="space-y-2">
                    {keyPoints.map((pt, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] leading-relaxed flex items-start gap-2 shadow-2xs"
                      >
                        <span className="text-[var(--color-ai)] font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No major points detected.</p>
                )}
              </div>

              {/* 2. Decisions */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Decisions Made ({decisions.length})</span>
                </h3>
                {decisions.length > 0 ? (
                  <ul className="space-y-2">
                    {decisions.map((dec, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-[var(--color-ink)] leading-relaxed flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No explicit decisions recorded.</p>
                )}
              </div>

              {/* 3. Open Questions / Action Items */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open Questions &amp; Items ({openQuestions.length})</span>
                </h3>
                {openQuestions.length > 0 ? (
                  <ul className="space-y-2">
                    {openQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[var(--color-ink)] leading-relaxed flex items-start gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-ink-muted)] italic">No unresolved questions detected.</p>
                )}
              </div>

              {/* 4. Citations Chips */}
              {citations.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-border)] space-y-2.5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-ink-muted)] flex items-center gap-1.5">
                    <span>Cited Messages ({citations.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {citations.map((c, i) => (
                      <CitationChip
                        key={`${c.message_id}_${i}`}
                        citation={c}
                        workspaceId={workspaceId}
                        onJump={() => {
                          onClose();
                          // navigate with messageId
                          window.location.href = `/workspace/${workspaceId}/channel/${channelId}?messageId=${c.message_id}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
