"use client";

import * as React from "react";
import { motion } from "motion/react";

interface StepConfig {
  chip: string;
  word: "connect" | "chat" | "ask";
  targetId: string;
  text: string;
  ai?: boolean;
}

const STEPS: StepConfig[] = [
  {
    chip: "Connect",
    word: "connect",
    targetId: "fc-btn-link",
    text: "Link this channel to Slack and Discord. One click — no tokens to paste.",
  },
  {
    chip: "Send",
    word: "chat",
    targetId: "fc-btn-send",
    text: "Send a message the way you always would.",
  },
  {
    chip: "Receive",
    word: "connect",
    targetId: "fc-plat-discord",
    text: "It lands in Slack under your own name. Meanwhile a teammate replies from Discord.",
  },
  {
    chip: "Ask",
    word: "ask",
    targetId: "fc-nav-assist",
    text: "Ask about anything your team said — on any platform.",
    ai: true,
  },
  {
    chip: "Verify",
    word: "ask",
    targetId: "fc-cite-slack",
    text: "Every answer links to the exact message behind it. This one came from Slack.",
    ai: true,
  },
];

export function InteractiveDemo() {
  const [isStarted, setIsStarted] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Applied step states
  const [isLinked, setIsLinked] = React.useState(false); // Step 0
  const [isMessageSent, setIsMessageSent] = React.useState(false); // Step 1
  const [isReplyReceived, setIsReplyReceived] = React.useState(false); // Step 2
  const [isAssistantView, setIsAssistantView] = React.useState(false); // Step 3
  const [isPriyaFlashed, setIsPriyaFlashed] = React.useState(false); // Step 4

  const stageRef = React.useRef<HTMLDivElement>(null);
  const spotRef = React.useRef<HTMLButtonElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);

  const [spotPos, setSpotPos] = React.useState<{ x: number; y: number } | null>(null);
  const [tipPos, setTipPos] = React.useState<{ x: number; y: number } | null>(null);

  // Check reduced motion preference
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isFinished = currentStep >= STEPS.length;
  const activeStepConfig = currentStep < STEPS.length ? STEPS[currentStep] : null;

  // Measurement-based placement computation
  const updatePlacement = React.useCallback(() => {
    if (!isStarted || isFinished || !activeStepConfig) {
      setSpotPos(null);
      setTipPos(null);
      return;
    }

    const stageEl = stageRef.current;
    if (!stageEl) return;

    const targetEl = document.getElementById(activeStepConfig.targetId);
    if (!targetEl) {
      setSpotPos(null);
      setTipPos(null);
      return;
    }

    const stageRect = stageEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const cx = targetRect.left + targetRect.width / 2 - stageRect.left;
    const cy = targetRect.top + targetRect.height / 2 - stageRect.top;

    setSpotPos({ x: cx, y: cy });

    const tipEl = tipRef.current;
    const tw = tipEl ? tipEl.offsetWidth : 248;
    const th = tipEl ? tipEl.offsetHeight : 110;
    const gap = 20;

    let tx = cx + gap;
    let ty = cy + gap;

    if (tx + tw > stageRect.width - 4) {
      tx = cx - gap - tw;
    }
    if (tx < 4) {
      tx = Math.max(4, (stageRect.width - tw) / 2);
    }
    if (ty + th > stageRect.height - 4) {
      ty = cy - gap - th;
    }
    if (ty < 4) {
      ty = 4;
    }

    setTipPos({ x: tx, y: ty });
  }, [isStarted, isFinished, activeStepConfig]);

  // Recalculate positions after DOM updates, resize, font load
  React.useLayoutEffect(() => {
    updatePlacement();
    const timer1 = setTimeout(updatePlacement, 100);
    const timer2 = setTimeout(updatePlacement, 420);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [updatePlacement, currentStep, isAssistantView, isStarted]);

  React.useEffect(() => {
    window.addEventListener("resize", updatePlacement);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePlacement);
    }

    const stageEl = stageRef.current;
    let observer: ResizeObserver | null = null;
    if (stageEl && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        updatePlacement();
      });
      observer.observe(stageEl);
    }

    return () => {
      window.removeEventListener("resize", updatePlacement);
      if (observer) observer.disconnect();
    };
  }, [updatePlacement]);

  // Apply step forward
  const applyStepForward = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Connect
        setIsLinked(true);
        break;
      case 1: // Send
        setIsMessageSent(true);
        break;
      case 2: // Receive
        setIsReplyReceived(true);
        break;
      case 3: // Ask
        setIsAssistantView(true);
        break;
      case 4: // Verify
        setIsAssistantView(false);
        setIsPriyaFlashed(true);
        break;
    }
  };

  // Undo step backwards
  const undoStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Undo Connect
        setIsLinked(false);
        break;
      case 1: // Undo Send
        setIsMessageSent(false);
        break;
      case 2: // Undo Receive
        setIsReplyReceived(false);
        break;
      case 3: // Undo Ask
        setIsAssistantView(false);
        break;
      case 4: // Undo Verify
        setIsAssistantView(true);
        setIsPriyaFlashed(false);
        break;
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
    // Reset all states
    setIsLinked(false);
    setIsMessageSent(false);
    setIsReplyReceived(false);
    setIsAssistantView(false);
    setIsPriyaFlashed(false);
    setTimeout(() => {
      updatePlacement();
      spotRef.current?.focus();
    }, 50);
  };

  const handleNext = React.useCallback(() => {
    if (!isStarted || currentStep >= STEPS.length) return;
    applyStepForward(currentStep);
    setCurrentStep((prev) => prev + 1);
  }, [isStarted, currentStep]);

  const handleBack = React.useCallback(() => {
    if (!isStarted || currentStep === 0) return;
    const targetStepToUndo = currentStep - 1;
    undoStep(targetStepToUndo);
    setCurrentStep((prev) => prev - 1);
  }, [isStarted, currentStep]);

  const handleReplay = () => {
    setIsLinked(false);
    setIsMessageSent(false);
    setIsReplyReceived(false);
    setIsAssistantView(false);
    setIsPriyaFlashed(false);
    setCurrentStep(0);
    setTimeout(() => {
      updatePlacement();
      spotRef.current?.focus();
    }, 50);
  };

  // Arrow key navigation
  React.useEffect(() => {
    if (!isStarted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStarted, handleNext, handleBack]);

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink">
          See it work
        </h2>
        <p className="text-base sm:text-lg text-ink-muted">
          Five clicks through a real workflow. No sign-up.
        </p>
      </div>

      {/* Demo Outer Container */}
      <div className="fc-demo" id="fc-demo">
        {/* Laptop Lid */}
        <div className="fc-lid">
          {/* Laptop Screen */}
          <div className="fc-screen">
            {/* Stage */}
            <div ref={stageRef} id="fc-stage" className="fc-stage relative">
              {/* Browser Window */}
              <div className="fc-browser">
                {/* Browser Chrome Bar */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-surface-2 border-b border-border">
                  <div className="flex gap-1.5 shrink-0">
                    <i className="w-2.5 h-2.5 rounded-full bg-border block not-italic" />
                    <i className="w-2.5 h-2.5 rounded-full bg-border block not-italic" />
                    <i className="w-2.5 h-2.5 rounded-full bg-border block not-italic" />
                  </div>
                  <div className="flex-1 min-w-0 font-mono text-[11.5px] text-ink-muted bg-surface border border-border rounded-[6px] px-2.5 py-1 truncate">
                    fistachat.app/workspace/northwind/launch
                  </div>
                </div>

                {/* App Interior */}
                <div className="fc-app">
                  {/* Sidebar */}
                  <aside className="fc-side bg-surface-2 border-r border-border p-3 flex flex-col gap-3.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-[7px] bg-primary text-white grid place-items-center font-semibold text-xs shrink-0">
                        N
                      </span>
                      <b className="text-[13px] font-semibold text-ink truncate">Northwind Labs</b>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-semibold text-ink-muted uppercase tracking-wider pl-1.5 mb-1">
                        Channels
                      </div>
                      <nav className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-ink-muted text-left transition-colors hover:text-ink"
                        >
                          <span className="opacity-65 font-medium">#</span>
                          <span className="truncate">general</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-ink-muted text-left transition-colors hover:text-ink"
                        >
                          <span className="opacity-65 font-medium">#</span>
                          <span className="truncate">product</span>
                        </button>
                        <button
                          type="button"
                          id="fc-nav-launch"
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-left transition-colors ${
                            !isAssistantView
                              ? "bg-primary text-white font-medium shadow-xs"
                              : "text-ink-muted hover:text-ink"
                          }`}
                        >
                          <span className="opacity-75 font-medium">#</span>
                          <span className="truncate">launch</span>
                        </button>
                      </nav>
                    </div>

                    <div>
                      <div className="text-[10.5px] font-semibold text-ink-muted uppercase tracking-wider pl-1.5 mb-1">
                        Workspace
                      </div>
                      <nav className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          id="fc-nav-assist"
                          onClick={() => {
                            if (isStarted && currentStep === 3) handleNext();
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-left transition-colors cursor-pointer ${
                            isAssistantView
                              ? "bg-ai text-white font-medium shadow-xs"
                              : "text-ink-muted hover:text-ink"
                          }`}
                        >
                          <span className="font-medium text-xs">◇</span>
                          <span className="truncate">Assistant</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-ink-muted text-left transition-colors hover:text-ink"
                        >
                          <span className="opacity-65 font-medium text-xs">⌕</span>
                          <span className="truncate">Search</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] text-[13px] text-ink-muted text-left transition-colors hover:text-ink"
                        >
                          <span className="opacity-65 font-medium text-xs">⚙</span>
                          <span className="truncate">Settings</span>
                        </button>
                      </nav>
                    </div>
                  </aside>

                  {/* Channel View */}
                  {!isAssistantView ? (
                    <main id="fc-chan" className="fc-chan">
                      {/* Channel Header */}
                      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border flex-wrap shrink-0">
                        <h3 className="text-[14.5px] font-semibold text-ink flex items-center gap-1 m-0">
                          <span className="text-ink-muted font-medium">#</span>
                          <span>launch</span>
                        </h3>

                        {isLinked && (
                          <>
                            <span
                              id="fc-hdr-slack"
                              className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full text-white bg-[#4A154B] whitespace-nowrap"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-85" />
                              Slack
                            </span>
                            <span
                              id="fc-hdr-discord"
                              className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full text-white bg-[#5865F2] whitespace-nowrap"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-85" />
                              Discord
                            </span>
                          </>
                        )}

                        <button
                          id="fc-btn-link"
                          type="button"
                          onClick={() => {
                            if (isStarted && currentStep === 0) handleNext();
                          }}
                          className="ml-auto text-[11.5px] font-medium cursor-pointer bg-surface text-ink border border-border px-2.5 py-1 rounded-[7px] hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {isLinked ? "Linked" : "Link channel"}
                        </button>
                      </div>

                      {/* Message Feed */}
                      <div className="fc-msgs">
                        {/* Bob Okafor Message */}
                        <div className="flex gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-white text-[11px] font-semibold bg-[#16A37F]">
                            BO
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                              <span className="text-[13px] font-semibold text-ink">Bob Okafor</span>
                              <span className="text-[11px] text-ink-muted">9:14</span>
                            </div>
                            <p className="text-[13.5px] text-ink m-0 leading-normal">
                              Checkout is failing on the refund path &mdash; the payments webhook times out.
                            </p>
                          </div>
                        </div>

                        {/* Priya Raman Message (Flashes in Step 5 Verify) */}
                        <div className="flex gap-2.5 min-w-0" id="fc-msg-priya">
                          <span className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-white text-[11px] font-semibold bg-[#4A154B]">
                            PR
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                              <span className="text-[13px] font-semibold text-ink">Priya Raman</span>
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-medium px-1.5 py-0.5 rounded-full text-white bg-[#4A154B] leading-none">
                                <span className="w-1 h-1 rounded-full bg-current opacity-85" />
                                Slack
                              </span>
                              <span className="text-[11px] text-ink-muted">9:15</span>
                            </div>
                            <p
                              className={`text-[13.5px] text-ink m-0 leading-normal rounded-[6px] transition-colors ${
                                isPriyaFlashed ? "animate-msg-flash px-1.5 py-0.5 -mx-1.5" : ""
                              }`}
                            >
                              Refunds are blocked for everyone on the new checkout.
                            </p>
                          </div>
                        </div>

                        {/* Alice Chen Message 1 */}
                        <div className="flex gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-white text-[11px] font-semibold bg-[#2F6BFF]">
                            AC
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                              <span className="text-[13px] font-semibold text-ink">Alice Chen</span>
                              <span className="text-[11px] text-ink-muted">9:16</span>
                            </div>
                            <p className="text-[13.5px] text-ink m-0 leading-normal">
                              How bad is it? Does this block the release?
                            </p>
                          </div>
                        </div>

                        {/* Alice Chen Message 2 (Appears Step 1 Send) */}
                        {isMessageSent && (
                          <motion.div
                            id="fc-msg-sent"
                            initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                              reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.2, 0.7, 0.3, 1] }
                            }
                            className="flex gap-2.5 min-w-0"
                          >
                            <span className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-white text-[11px] font-semibold bg-[#2F6BFF]">
                              AC
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                                <span className="text-[13px] font-semibold text-ink">Alice Chen</span>
                                <span className="text-[11px] text-ink-muted">9:18</span>
                              </div>
                              <p className="text-[13.5px] text-ink m-0 leading-normal">
                                Pushing the launch to October 14 so the refund fix ships first.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Marco Diaz Message (Appears Step 2 Receive) */}
                        {isReplyReceived && (
                          <motion.div
                            id="fc-msg-marco"
                            initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                              reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.2, 0.7, 0.3, 1] }
                            }
                            className="flex gap-2.5 min-w-0"
                          >
                            <span className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-white text-[11px] font-semibold bg-[#5865F2]">
                              MD
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                                <span className="text-[13px] font-semibold text-ink">Marco Diaz</span>
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-medium px-1.5 py-0.5 rounded-full text-white bg-[#5865F2] leading-none">
                                  <span className="w-1 h-1 rounded-full bg-current opacity-85" />
                                  Discord
                                </span>
                                <span className="text-[11px] text-ink-muted">9:21</span>
                              </div>
                              <p className="text-[13.5px] text-ink m-0 leading-normal">
                                Confirmed on the community beta too &mdash; three reports this morning.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Composer */}
                      <div className="mx-3.5 mb-3.5 border border-border rounded-[10px] bg-surface flex items-center gap-2 px-3 py-2 shrink-0">
                        <span
                          id="fc-draft"
                          className={`flex-1 min-w-0 text-[13.5px] truncate ${
                            isMessageSent ? "text-ink-muted" : "text-ink"
                          }`}
                        >
                          {isMessageSent
                            ? "Message #launch"
                            : "Pushing the launch to October 14 so the refund fix ships first."}
                        </span>
                        <button
                          id="fc-btn-send"
                          type="button"
                          onClick={() => {
                            if (isStarted && currentStep === 1) handleNext();
                          }}
                          className="text-[12px] font-medium cursor-pointer shrink-0 bg-primary text-white border-0 py-1.5 px-3 rounded-[7px] hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          Send
                        </button>
                      </div>
                    </main>
                  ) : (
                    /* Assistant View */
                    <section id="fc-assist" className="flex flex-col min-w-0 h-full">
                      {/* Assistant Header */}
                      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-border shrink-0">
                        <h3 className="text-[14.5px] font-semibold text-ink m-0">Assistant</h3>
                        <span className="text-[10.5px] font-medium text-ai bg-ai/10 px-2 py-0.5 rounded-full">
                          Reads every linked platform
                        </span>
                      </div>

                      {/* Assistant Thread */}
                      <div className="flex-1 p-3.5 flex flex-col gap-3 overflow-hidden">
                        {/* User Question */}
                        <div className="self-end max-w-[82%] bg-surface-2 border border-border px-3 py-2 rounded-[12px_12px_4px_12px] text-[13.5px] text-ink">
                          What did we decide about the launch date?
                        </div>

                        {/* AI Answer */}
                        <div className="max-w-[94%]">
                          <div className="flex items-center gap-1.5 text-[11px] text-ai font-medium mb-1">
                            <span className="w-3.5 h-3.5 rounded-[4px] bg-ai inline-block" />
                            <span>Answer</span>
                          </div>
                          <p className="m-0 mb-2.5 text-[13.5px] text-ink leading-relaxed">
                            The launch moved to <b>October 14</b> so the refund fix ships first. The payments webhook
                            was timing out on the refund path, which blocked refunds for everyone on the new checkout,
                            and it was confirmed on the community beta as well.
                          </p>
                          {/* Citation Chips */}
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              className="text-[11px] cursor-pointer inline-flex items-center gap-1.5 bg-surface border border-border text-ink py-1 pr-2.5 pl-1 rounded-full hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <span className="w-3.5 h-3.5 rounded-[4px] grid place-items-center text-white text-[8px] font-bold shrink-0 bg-[#2F6BFF]">
                                F
                              </span>
                              <span>Alice Chen</span>
                            </button>

                            <button
                              id="fc-cite-slack"
                              type="button"
                              onClick={() => {
                                if (isStarted && currentStep === 4) handleNext();
                              }}
                              className="text-[11px] cursor-pointer inline-flex items-center gap-1.5 bg-surface border border-border text-ink py-1 pr-2.5 pl-1 rounded-full hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <span className="w-3.5 h-3.5 rounded-[4px] grid place-items-center text-white text-[8px] font-bold shrink-0 bg-[#4A154B]">
                                S
                              </span>
                              <span>Priya Raman</span>
                            </button>

                            <button
                              type="button"
                              className="text-[11px] cursor-pointer inline-flex items-center gap-1.5 bg-surface border border-border text-ink py-1 pr-2.5 pl-1 rounded-full hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <span className="w-3.5 h-3.5 rounded-[4px] grid place-items-center text-white text-[8px] font-bold shrink-0 bg-[#5865F2]">
                                D
                              </span>
                              <span>Marco Diaz</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Platform Panes Column */}
              <div className="fc-plats">
                {/* Slack Pane */}
                <div
                  id="fc-plat-slack"
                  className={`bg-surface border border-border rounded-[12px] shadow-sm overflow-hidden transition-opacity duration-500 max-[900px]:flex-1 max-[900px]:min-w-0 ${
                    isLinked ? "opacity-100" : "opacity-55"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-[12px] font-semibold text-ink">
                    <span className="w-4 h-4 rounded-[5px] grid place-items-center text-white text-[9px] font-bold shrink-0 bg-[#4A154B]">
                      S
                    </span>
                    <span>Slack</span>
                    <span className="text-ink-muted font-normal truncate">&middot; #launch</span>
                  </div>

                  <div className="p-2.5 flex flex-col gap-2.5 h-[106px] overflow-hidden">
                    <div className="flex gap-2 min-w-0">
                      <span className="w-5.5 h-5.5 rounded-[6px] shrink-0 grid place-items-center text-white text-[9px] font-semibold bg-[#4A154B]">
                        PR
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-[11.5px] font-semibold text-ink">Priya Raman</span>
                        </div>
                        <p className="text-[11.5px] text-ink-muted m-0 mt-0.5 leading-snug">
                          Refunds are blocked for everyone on the new checkout.
                        </p>
                      </div>
                    </div>

                    {isMessageSent && (
                      <motion.div
                        id="fc-slack-echo"
                        initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                          reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.2, 0.7, 0.3, 1] }
                        }
                        className="flex gap-2 min-w-0"
                      >
                        <span className="w-5.5 h-5.5 rounded-[6px] shrink-0 grid place-items-center text-white text-[9px] font-semibold bg-[#2F6BFF]">
                          AC
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-[11.5px] font-semibold text-ink">Alice Chen (via FistaChat)</span>
                            <span className="text-[8.5px] font-semibold tracking-wider bg-surface-2 text-ink-muted px-1 py-0.5 rounded-[3px]">
                              APP
                            </span>
                          </div>
                          <p className="text-[11.5px] text-ink-muted m-0 mt-0.5 leading-snug">
                            Pushing the launch to October 14 so the refund fix ships first.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Discord Pane */}
                <div
                  id="fc-plat-discord"
                  onClick={() => {
                    if (isStarted && currentStep === 2) handleNext();
                  }}
                  className={`bg-surface border border-border rounded-[12px] shadow-sm overflow-hidden transition-opacity duration-500 max-[900px]:flex-1 max-[900px]:min-w-0 ${
                    isLinked ? "opacity-100" : "opacity-55"
                  } ${isStarted && currentStep === 2 ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-[12px] font-semibold text-ink">
                    <span className="w-4 h-4 rounded-[5px] grid place-items-center text-white text-[9px] font-bold shrink-0 bg-[#5865F2]">
                      D
                    </span>
                    <span>Discord</span>
                    <span className="text-ink-muted font-normal truncate">&middot; #launch</span>
                  </div>

                  <div className="p-2.5 flex flex-col gap-2.5 h-[106px] overflow-hidden">
                    {!isReplyReceived ? (
                      <div id="fc-discord-empty" className="text-[11.5px] text-ink-muted opacity-80 my-auto text-center">
                        Quiet so far
                      </div>
                    ) : (
                      <motion.div
                        id="fc-discord-msg"
                        initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                          reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.2, 0.7, 0.3, 1] }
                        }
                        className="flex gap-2 min-w-0"
                      >
                        <span className="w-5.5 h-5.5 rounded-[6px] shrink-0 grid place-items-center text-white text-[9px] font-semibold bg-[#5865F2]">
                          MD
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-[11.5px] font-semibold text-ink">Marco Diaz</span>
                          </div>
                          <p className="text-[11.5px] text-ink-muted m-0 mt-0.5 leading-snug">
                            Confirmed on the community beta too &mdash; three reports this morning.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Measurement-based Hotspot */}
              {isStarted && !isFinished && spotPos && (
                <button
                  ref={spotRef}
                  id="fc-spot"
                  type="button"
                  aria-describedby="fc-tip"
                  aria-label="Advance to next step in interactive demo"
                  onClick={handleNext}
                  style={{ left: `${spotPos.x}px`, top: `${spotPos.y}px` }}
                  className="absolute w-[26px] h-[26px] -ml-[13px] -mt-[13px] p-0 border-0 rounded-full cursor-pointer bg-primary z-30 shadow-[0_0_0_4px_var(--color-surface),0_4px_14px_rgba(11,19,36,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.95)_0_2px,transparent_3px)] after:content-[''] after:absolute after:inset-[-6px] after:rounded-full after:border-2 after:border-primary after:animate-hotspot-ping"
                />
              )}

              {/* Dynamic Measurement-based Tooltip */}
              {isStarted && !isFinished && tipPos && activeStepConfig && (
                <div
                  ref={tipRef}
                  id="fc-tip"
                  role="status"
                  style={{ left: `${tipPos.x}px`, top: `${tipPos.y}px` }}
                  className="absolute z-30 w-[min(248px,76vw)] bg-surface border border-border rounded-[11px] shadow-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span id="fc-tip-num" className="font-mono text-[10px] text-ink-muted">
                      0{currentStep + 1}
                    </span>
                    <span
                      id="fc-tip-chip"
                      className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                        activeStepConfig.ai ? "text-ai bg-ai/10" : "text-primary bg-primary/10"
                      }`}
                    >
                      {activeStepConfig.chip}
                    </span>
                  </div>
                  <p id="fc-tip-text" className="m-0 text-[13px] leading-relaxed text-ink">
                    {activeStepConfig.text}
                  </p>
                  <div id="fc-tip-hint" className="mt-2 text-[11px] text-ink-muted">
                    {currentStep === STEPS.length - 1 ? "Last step" : "Click the blue dot to continue"}
                  </div>
                </div>
              )}
            </div>

            {/* Start Gate Overlay */}
            {!isStarted && (
              <div
                id="fc-gate"
                className="absolute inset-0 z-20 grid place-items-center bg-[color-mix(in_srgb,var(--color-bg)_60%,transparent)] backdrop-blur-[2px] transition-opacity"
              >
                <button
                  id="fc-go"
                  type="button"
                  onClick={handleStart}
                  className="font-sans text-[14.5px] font-semibold text-ink bg-surface border border-border rounded-full py-3 px-6 shadow-xl flex items-center gap-2.5 hover:border-primary/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-primary relative shrink-0 after:content-[''] after:absolute after:inset-[-5px] after:rounded-full after:border-2 after:border-primary after:animate-hotspot-ping" />
                  <span>Start interactive demo</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Laptop Base */}
        <div className="fc-base" id="fc-base" />

        {/* Step Progress Rail */}
        {isStarted && (
          <div
            id="fc-rail"
            className="mt-4 p-3 bg-surface border border-border rounded-[12px] shadow-sm flex items-center gap-3.5 flex-wrap"
          >
            <div id="fc-track" className="flex items-center gap-2 flex-1 min-w-[150px] flex-wrap">
              {STEPS.map((s, idx) => {
                const isDone = idx < currentStep;
                const isNow = idx === currentStep;
                return (
                  <span
                    key={s.chip}
                    className={`fc-node flex items-center gap-1.5 text-[11.5px] ${
                      isNow
                        ? "fc-node now text-ink font-medium"
                        : isDone
                        ? "fc-node done text-ink-muted"
                        : "text-ink-muted"
                    }`}
                  >
                    <i
                      className={`w-2 h-2 rounded-full block not-italic transition-all ${
                        isNow
                          ? "bg-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                          : isDone
                          ? "bg-live"
                          : "bg-border"
                      }`}
                    />
                    <span>{s.chip}</span>
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="fc-back"
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-3 py-1.5 rounded-[8px] bg-surface-2 text-ink border border-border text-xs font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-2/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Back
              </button>
              <button
                id="fc-next"
                type="button"
                onClick={handleNext}
                disabled={isFinished}
                className="px-3 py-1.5 rounded-[8px] bg-primary text-white border-0 text-xs font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Completion End Card */}
        {isFinished && (
          <div
            id="fc-done"
            className="mt-3.5 p-5 rounded-[14px] border border-border bg-gradient-to-b from-sky-top/40 to-surface shadow-sm flex gap-4 items-center justify-between flex-wrap"
          >
            <div>
              <h3 className="text-xl font-bold font-headline text-ink tracking-tight mb-1">
                That was the whole product.
              </h3>
              <p className="m-0 text-[13.5px] text-ink-muted max-w-[44ch]">
                One place for your team, linked to the tools they already use, with an assistant that shows its work.
              </p>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <a
                href="/signup"
                className="px-4 py-2 rounded-[8px] bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex items-center"
              >
                Create a free workspace
              </a>
              <button
                id="fc-replay"
                type="button"
                onClick={handleReplay}
                className="px-3.5 py-2 rounded-[8px] bg-surface-2 text-ink border border-border text-xs font-medium cursor-pointer hover:bg-surface-2/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Replay demo
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
