"use client";

import React from "react";
import { useRealtime } from "../useRealtime";

interface OnlineDotProps {
  userId?: string;
  isOnline?: boolean;
}

export function OnlineDot({ userId, isOnline }: OnlineDotProps) {
  const { onlineUsers } = useRealtime();

  const active = isOnline ?? (userId ? onlineUsers.has(userId) : false);

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full border-2 border-[var(--color-surface)] shrink-0 ${
        active ? "bg-[var(--color-live)]" : "bg-gray-400 opacity-50"
      }`}
      title={active ? "Online" : "Offline"}
    />
  );
}
