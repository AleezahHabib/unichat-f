"use client";

import * as React from "react";
import { Sparkles, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useRevealMotion } from "../animation";

export function AssistantShowcase() {
  const { headingProps, singleFadeProps } = useRevealMotion();

  return (
    <section id="assistant" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[24px] bg-ai/5 border border-ai/20 p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Copy Left - Section Heading & Intro lines */}
        <motion.div {...headingProps} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai/10 border border-ai/30 text-xs font-semibold text-ai">
              <Sparkles className="w-4 h-4 text-ai" />
              <span>Grounded Intelligence</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-ink leading-tight">
            Ask your channels anything. Get answers backed by exact source citations.
          </h2>

          <p className="text-base text-ink-muted leading-relaxed">
            The assistant has read everything the team said across UniChat, Slack, and Discord, and every answer shows the exact messages it came from with direct clickable links.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-ink-muted border-t border-ai/20">
            <Shield className="w-4 h-4 text-ai shrink-0" />
            <span>It only reads channels you&apos;ve joined. Private conversations stay private.</span>
          </div>
        </motion.div>

        {/* Static Cited Conversation Right - Assistant Showcase Single Fade-in */}
        <motion.div
          {...singleFadeProps}
          className="p-6 rounded-[18px] bg-surface border border-ai/30 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="font-bold text-sm text-ink">UniChat Assistant</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-[12px] bg-surface-2 text-xs sm:text-sm text-ink leading-relaxed">
              <span className="font-bold text-primary block text-xs mb-1">User Question</span>
              When is our team&apos;s product beta release scheduled, and what was decided about the onboarding rollout?
            </div>

            <div className="p-4 rounded-[12px] bg-surface-2 border border-ai/20 text-xs sm:text-sm text-ink leading-relaxed">
              <span className="font-bold text-ai block text-xs mb-1">Answer</span>
              The team agreed to target <strong className="text-ink font-semibold">Thursday, November 14th</strong> for the customer beta release. Staging validation wraps up early next week, and onboarding updates will be shared directly across our connected team channels.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
