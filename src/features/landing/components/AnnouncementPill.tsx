import * as React from "react";
import { Sparkles } from "lucide-react";

export function AnnouncementPill() {
  return (
    <div className="flex justify-center pt-8 pb-4 px-4">
      <a
        href="#assistant"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai/10 border border-ai/20 text-xs sm:text-sm font-medium text-ai hover:bg-ai/15 focus:outline-none focus:ring-2 focus:ring-ai transition-all"
      >
        <Sparkles className="w-4 h-4 text-ai shrink-0" />
        <span>New: answers link to the messages they came from</span>
      </a>
    </div>
  );
}
