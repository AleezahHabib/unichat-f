"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  chatWithAssistant,
  getAssistantHistory,
  AssistantChatResponse,
  Citation,
} from "../api";
import { CitationChip } from "./CitationChip";
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, AlertCircle, Clock, ShieldAlert } from "lucide-react";
import { ApiError } from "@/lib/api-client";

interface AssistantChatProps {
  workspaceId: string;
}

const SUGGESTED_PROMPTS = [
  "Summarize #general from today",
  "What did we decide about the launch date?",
  "Who owns the refund fix?",
];

const LOADING_STEPS = [
  "Searching channel message context...",
  "Reading team discussion threads...",
  "Synthesizing grounded answer...",
  "Verifying citations across sources...",
];

export function AssistantChat({ workspaceId }: AssistantChatProps) {
  const [messages, setMessages] = useState<AssistantChatResponse[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [aiDisabled, setAiDisabled] = useState(false);
  const [busyCountdown, setBusyCountdown] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let sid = localStorage.getItem(`unichat_assistant_session_${workspaceId}`);
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem(`unichat_assistant_session_${workspaceId}`, sid);
    }
    setSessionId(sid);

    // Load session history
    getAssistantHistory(workspaceId, sid)
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(history);
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === "ai_disabled") {
          setAiDisabled(true);
        }
      });
  }, [workspaceId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Loading step cycling animation
  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

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

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading || busyCountdown !== null || aiDisabled) return;

    setErrorMsg(null);
    setInput("");

    // Optimistically add user message
    const tempUserMsg: AssistantChatResponse = {
      id: "temp_" + Date.now(),
      session_id: sessionId,
      role: "user",
      content: textToSend,
      citations: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(workspaceId, sessionId, textToSend);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.code === "ai_disabled") {
          setAiDisabled(true);
        } else if (err.code === "ai_busy") {
          const waitSec = err.retryAfter || 15;
          setBusyCountdown(waitSec);
        } else {
          setErrorMsg(err.message || "Failed to get AI response");
        }
      } else {
        setErrorMsg(err?.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetSession = () => {
    const newSid = "session_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(`unichat_assistant_session_${workspaceId}`, newSid);
    setSessionId(newSid);
    setMessages([]);
    setErrorMsg(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--color-bg)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-ai)]/15 text-[var(--color-ai)] flex items-center justify-center border border-[var(--color-ai)]/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-[var(--color-ink)] font-[var(--font-headline)] flex items-center gap-2">
              <span>UniChat AI Assistant</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-ai)]/10 text-[var(--color-ai)] border border-[var(--color-ai)]/20">
                Gemini Intelligence
              </span>
            </h1>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Grounded Q&A with real source message citations across all linked channels.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSession}
          title="New session"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border border-[var(--color-border)] transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </header>

      {/* AI Disabled Calm Banner (STEP 3) */}
      {aiDisabled && (
        <div className="mx-6 mt-4 p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[var(--color-ink-muted)] shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[var(--color-ink)]">AI Assistant Offline</div>
            <div className="mt-0.5">
              The AI assistant is currently disabled in this deployment environment. Standard channel messaging, cross-platform relays, and keyword search continue to function normally.
            </div>
          </div>
        </div>
      )}

      {/* AI Busy Countdown Banner (STEP 3) */}
      {busyCountdown !== null && (
        <div className="mx-6 mt-4 p-4 rounded-2xl bg-[var(--color-ai)]/10 border border-[var(--color-ai)]/30 text-xs text-[var(--color-ai)] flex items-center gap-3 animate-pulse">
          <Clock className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-semibold">AI Service Busy:</span> Rate limit budget reached. Resuming in{" "}
            <span className="font-bold font-mono text-sm">{busyCountdown}s</span>...
          </div>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[var(--color-ai)]/10 text-[var(--color-ai)] flex items-center justify-center border border-[var(--color-ai)]/20 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
                Ask anything about your team&apos;s chats
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                Answers are grounded strictly in your joined channels and cite real messages from UniChat, Slack, and Discord.
              </p>
            </div>

            {/* Suggested Prompts Pills */}
            <div className="w-full space-y-2 pt-2">
              <div className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider">
                Suggested questions
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={aiDisabled || busyCountdown !== null}
                    className="w-full p-3 text-left rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-ai)] hover:bg-[var(--color-ai)]/5 text-xs text-[var(--color-ink)] font-medium transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <span>{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isAssistant ? "items-start" : "items-start flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                      isAssistant
                        ? "bg-[var(--color-ai)] text-white"
                        : "bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)]"
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex-1 max-w-[85%] rounded-2xl p-4 space-y-3 ${
                      isAssistant
                        ? "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] shadow-xs"
                        : "bg-[var(--color-primary)] text-white ml-auto"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>

                    {/* Citations section if assistant returned citations */}
                    {isAssistant && msg.citations && msg.citations.length > 0 && (
                      <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                        <div className="text-[11px] font-semibold text-[var(--color-ink-muted)] flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[var(--color-ai)]" />
                          <span>Sources &amp; Citations ({msg.citations.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((c, idx) => (
                            <CitationChip
                              key={`${c.message_id}_${idx}`}
                              citation={c}
                              workspaceId={workspaceId}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Descriptive Step Loader (NOT a bare spinner) */}
            {isLoading && (
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-ai)] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="rounded-2xl p-4 bg-[var(--color-surface)] border border-[var(--color-ai)]/30 text-[var(--color-ink)] space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ai)]">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-ai)] animate-ping" />
                    <span>{LOADING_STEPS[loadingStepIndex]}</span>
                  </div>
                  <div className="w-48 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-ai)] rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-xs text-[var(--color-danger)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] shrink-0">
        <div className="max-w-3xl mx-auto relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || aiDisabled || busyCountdown !== null}
            placeholder={
              aiDisabled
                ? "AI Assistant is disabled."
                : busyCountdown !== null
                ? `Please wait ${busyCountdown}s...`
                : "Ask about decisions, roadmaps, bug ownership, or summarize a channel..."
            }
            rows={2}
            className="flex-1 p-3 pr-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)] transition disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || aiDisabled || busyCountdown !== null}
            className="absolute right-3 bottom-3 p-2 rounded-xl bg-[var(--color-ai)] text-white hover:opacity-90 disabled:opacity-30 transition shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
