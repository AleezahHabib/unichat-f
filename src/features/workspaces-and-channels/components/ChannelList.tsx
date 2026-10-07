"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Channel } from "../api";
import { ChannelLink } from "@/features/integrations/api";
import { ChevronDown, ChevronRight, Hash, Search, Plus } from "lucide-react";

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

  // Collapsible state persisted in localStorage per workspace
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`unichat_channels_collapsed_${workspaceId}`);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [workspaceId]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`unichat_channels_collapsed_${workspaceId}`, String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {/* Slack-style Section Header */}
      <div className="flex items-center justify-between px-1 py-1 rounded-lg group text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition select-none">
        <button
          onClick={toggleCollapse}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-left py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] rounded"
          title={isCollapsed ? "Expand Channels" : "Collapse Channels"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 transition-transform shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 transition-transform shrink-0" />
          )}
          <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span>Channels</span>
        </button>

        <button
          onClick={onOpenBrowseModal}
          title="Browse and search channels"
          className="p-1 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition cursor-pointer"
          aria-label="Search channels"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Channels List (Collapsible) */}
      {!isCollapsed && (
        <nav className="space-y-0.5 pt-0.5">
          {channels.map((ch) => {
            const isActive = currentChannelId === ch.id;
            const links = channelLinks.filter((l) => l.channel_id === ch.id);

            return (
              <Link
                key={ch.id}
                href={`/workspace/${workspaceId}/channel/${ch.id}`}
                className={`flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl text-xs transition font-medium ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm font-semibold"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className="opacity-70 font-mono text-xs">#</span>
                  <span className="truncate">{ch.name}</span>
                </div>

                {links.length > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    {links.map((link) => (
                      <span
                        key={link.id}
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 truncate max-w-[90px] leading-tight ${
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

          {/* Persistent "+ Add channels" Row as LAST item */}
          <button
            onClick={onOpenBrowseModal}
            className="w-full flex items-center gap-2 px-3 py-1.5 mt-1 rounded-xl text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)] transition cursor-pointer text-left group"
          >
            <div className="w-4 h-4 rounded flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition text-[var(--color-ink-muted)]">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Add channels</span>
          </button>
        </nav>
      )}
    </div>
  );
}
