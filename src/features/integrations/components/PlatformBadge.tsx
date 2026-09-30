"use client";

import React from "react";

interface PlatformBadgeProps {
  platform: "slack" | "discord" | string;
  channelName?: string;
}

export function PlatformBadge({ platform, channelName }: PlatformBadgeProps) {
  const p = platform.toLowerCase();

  if (p === "slack") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-[10px] font-bold shadow-xs"
        style={{ backgroundColor: "#4A154B" }}
      >
        <span>Slack</span>
        {channelName && <span className="opacity-80">#{channelName}</span>}
      </span>
    );
  }

  if (p === "discord") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-[10px] font-bold shadow-xs"
        style={{ backgroundColor: "#5865F2" }}
      >
        <span>Discord</span>
        {channelName && <span className="opacity-80">#{channelName}</span>}
      </span>
    );
  }

  return null;
}
