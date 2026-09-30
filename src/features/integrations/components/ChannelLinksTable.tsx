"use client";

import React, { useState } from "react";
import { Channel } from "@/features/workspaces-and-channels/api";
import { ConnectedPlatform, ChannelLink, unlinkChannel } from "../api";
import { PlatformBadge } from "./PlatformBadge";
import { LinkChannelModal } from "./LinkChannelModal";

interface ChannelLinksTableProps {
  channels: Channel[];
  links: ChannelLink[];
  connectedPlatforms: ConnectedPlatform[];
  onRefresh: () => void;
}

export function ChannelLinksTable({
  channels,
  links,
  connectedPlatforms,
  onRefresh,
}: ChannelLinksTableProps) {
  const [activeModalChannelId, setActiveModalChannelId] = useState<string | null>(null);
  const [unlinkingKey, setUnlinkingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUnlink = async (
    channelId: string,
    platform: string,
    externalChannelId?: string,
    linkId?: string
  ) => {
    const key = linkId || `${channelId}-${platform}-${externalChannelId}`;
    setUnlinkingKey(key);
    setError(null);
    try {
      await unlinkChannel(channelId, platform);
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to unlink channel");
    } finally {
      setUnlinkingKey(null);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
            Channel Two-Way Links
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
            Map UniChat channels to external Slack or Discord channels for bidirectional syncing.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {channels.length === 0 ? (
        <div className="text-xs text-[var(--color-ink-muted)] py-4 text-center">
          No channels found in this workspace.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase">
                <th className="py-2.5 px-3">UniChat Channel</th>
                <th className="py-2.5 px-3">Active Integrations</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {channels.map((channel) => {
                const channelLinks = links.filter((l) => l.channel_id === channel.id);

                return (
                  <tr key={channel.id} className="hover:bg-[var(--color-surface-2)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-xs text-[var(--color-ink)]">
                        #{channel.name}
                      </div>
                      {channel.description && (
                        <div className="text-[10px] text-[var(--color-ink-muted)] truncate max-w-xs">
                          {channel.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {channelLinks.length === 0 ? (
                        <span className="text-xs text-[var(--color-ink-muted)] italic">
                          Not linked
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {channelLinks.map((link) => {
                            const isUnlinking =
                              unlinkingKey ===
                              (link.id || `${channel.id}-${link.platform}-${link.external_channel_id}`);
                            return (
                              <div
                                key={link.id}
                                className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]"
                              >
                                <PlatformBadge
                                  platform={link.platform}
                                  channelName={link.external_channel_name}
                                />
                                <button
                                  onClick={() =>
                                    handleUnlink(
                                      channel.id,
                                      link.platform,
                                      link.external_channel_id,
                                      link.id
                                    )
                                  }
                                  disabled={isUnlinking}
                                  title={`Unlink #${link.external_channel_name || link.platform}`}
                                  className="text-[10px] text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] px-1 transition-colors disabled:opacity-50"
                                >
                                  {isUnlinking ? "..." : "✕"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {connectedPlatforms.length === 0 ? (
                        <span className="text-[11px] text-[var(--color-ink-muted)]">
                          Connect a platform first
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveModalChannelId(channel.id)}
                          className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-xs font-semibold text-[var(--color-ink)] transition-colors border border-[var(--color-border)]"
                        >
                          + Link Channel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeModalChannelId && (
        <LinkChannelModal
          channelId={activeModalChannelId}
          isOpen={true}
          connectedPlatforms={connectedPlatforms}
          onClose={() => setActiveModalChannelId(null)}
          onLinked={() => {
            setActiveModalChannelId(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
