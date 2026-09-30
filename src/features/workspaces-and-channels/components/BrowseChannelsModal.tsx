"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Channel, joinChannel } from "../api";

interface BrowseChannelsModalProps {
  workspaceId: string;
  isOpen: boolean;
  channels: Channel[];
  onClose: () => void;
  onJoined: () => void;
}

export function BrowseChannelsModal({
  workspaceId,
  isOpen,
  channels,
  onClose,
  onJoined,
}: BrowseChannelsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleJoin = async (channelId: string) => {
    try {
      await joinChannel(channelId);
      onJoined();
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
      onClose();
    } catch (err: any) {
      console.error("Failed to join channel", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
            Browse Channels
          </h2>
          <button onClick={onClose} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-[var(--color-border)]">
          {channels.map((ch) => (
            <div key={ch.id} className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-[var(--color-ink)] flex items-center gap-1">
                  <span className="font-mono text-[var(--color-ink-muted)]">#</span>
                  {ch.name}
                </div>
                {ch.description && (
                  <p className="text-xs text-[var(--color-ink-muted)]">{ch.description}</p>
                )}
              </div>
              <button
                onClick={() => handleJoin(ch.id)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-semibold text-[var(--color-ink)] transition"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
