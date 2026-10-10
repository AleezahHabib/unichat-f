"use client";

import React from "react";

interface PlatformBadgeProps {
  platform: "slack" | "discord" | string;
  channelName?: string;
  showVia?: boolean;
}

export function PlatformBadge({ platform, channelName, showVia = false }: PlatformBadgeProps) {
  const p = platform.toLowerCase();

  if (p === "slack") {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-white text-[10px] font-bold shadow-xs shrink-0"
        style={{ backgroundColor: "#4A154B" }}
      >
        <span>{showVia ? "via Slack" : "Slack"}</span>
        {channelName && <span className="opacity-80">#{channelName}</span>}
      </span>
    );
  }

  if (p === "discord") {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-white text-[10px] font-bold shadow-xs shrink-0"
        style={{ backgroundColor: "#5865F2" }}
      >
        <span>{showVia ? "via Discord" : "Discord"}</span>
        {channelName && <span className="opacity-80">#{channelName}</span>}
      </span>
    );
  }

  return null;
}
