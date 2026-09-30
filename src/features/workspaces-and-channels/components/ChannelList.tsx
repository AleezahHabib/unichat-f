"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Channel } from "../api";

import { ChannelLink } from "@/features/integrations/api";

interface ChannelListProps {
  workspaceId: string;
  channels: Channel[];
  channelLinks?: ChannelLink[];
  onOpenCreateModal: () => void;
  onOpenBrowseModal: () => void;
}

export function ChannelList({
  workspaceId,
  channels,
  channelLinks = [],
  onOpenCreateModal,
  onOpenBrowseModal,
}: ChannelListProps) {
  const params = useParams();
  const currentChannelId = params?.channelId as string | undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
        <span>Channels</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenBrowseModal}
            title="Browse all channels"
            className="p-1 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
          >
            🔍
          </button>
          <button
            onClick={onOpenCreateModal}
            title="Create channel"
            className="p-1 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
          >
            +
          </button>
        </div>
      </div>

      <nav className="space-y-0.5">
        {channels.map((ch) => {
          const isActive = currentChannelId === ch.id;
          const links = channelLinks.filter((l) => l.channel_id === ch.id);

          return (
            <Link
              key={ch.id}
              href={`/workspace/${workspaceId}/channel/${ch.id}`}
              className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-sm transition font-medium ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <span className="opacity-70 font-mono">#</span>
                <span className="truncate">{ch.name}</span>
              </div>

              {links.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  {links.map((link) => (
                    <span
                      key={link.id}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 truncate max-w-[100px] leading-tight ${
                        isActive ? "bg-white/20 text-white" : "text-white"
                      }`}
                      style={
                        !isActive
                          ? {
                              backgroundColor:
                                link.platform === "slack" ? "#4A154B" : "#5865F2",
                            }
                          : {}
                      }
                      title={`Linked to ${link.platform}: #${link.external_channel_name}`}
                    >
                      #{link.external_channel_name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
