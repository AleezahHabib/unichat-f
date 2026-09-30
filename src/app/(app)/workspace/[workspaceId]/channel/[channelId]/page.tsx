"use client";

import React, { useState, useEffect, use } from "react";
import { useMessages } from "@/features/messaging/useMessages";
import { MessageList } from "@/features/messaging/components/MessageList";
import { MessageComposer } from "@/features/messaging/components/MessageComposer";
import { ThreadPanel } from "@/features/messaging/components/ThreadPanel";
import { Message } from "@/features/messaging/api";
import { getChannels, Channel } from "@/features/workspaces-and-channels/api";
import { TypingIndicator } from "@/features/realtime/components/TypingIndicator";
import { useRealtime } from "@/features/realtime/useRealtime";
import {
  getIntegrations,
  getWorkspaceChannelLinks,
  ConnectedPlatform,
  ChannelLink,
} from "@/features/integrations/api";
import { LinkChannelModal } from "@/features/integrations/components/LinkChannelModal";
import { PlatformBadge } from "@/features/integrations/components/PlatformBadge";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaceId, channelId } = resolvedParams;
  const { sendTyping } = useRealtime();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);
  const [activeThreadMessage, setActiveThreadMessage] = useState<Message | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const {
    messages,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    sendMessage,
    editMessage,
    removeMessage,
    clearMessages,
  } = useMessages(channelId);

  const handleClearChat = async () => {
    setIsClearing(true);
    try {
      await clearMessages();
      setIsClearModalOpen(false);
    } catch (err: any) {
      console.error("Failed to clear chat", err);
    } finally {
      setIsClearing(false);
    }
  };

  const loadChannelInfo = async () => {
    try {
      const [channels, integrations, links] = await Promise.all([
        getChannels(workspaceId),
        getIntegrations(workspaceId),
        getWorkspaceChannelLinks(workspaceId).catch(() => []),
      ]);
      const current = channels.find((c) => c.id === channelId);
      if (current) setChannel(current);
      setConnectedPlatforms(integrations);
      setChannelLinks(links.filter((l) => l.channel_id === channelId));
    } catch (err: any) {
      console.error("Failed to load channel info", err);
    }
  };

  useEffect(() => {
    loadChannelInfo();
  }, [workspaceId, channelId]);

  return (
    <div className="flex-1 flex h-full min-w-0 bg-[var(--color-bg)]">
      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Channel TopBar */}
        <header className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between shrink-0 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[var(--color-ink-muted)] text-lg">#</span>
              <h1 className="font-bold text-lg text-[var(--color-ink)] font-[var(--font-headline)]">
                {channel?.name || "channel"}
              </h1>

              {channelLinks.map((link) => (
                <PlatformBadge
                  key={link.id}
                  platform={link.platform}
                  channelName={link.external_channel_name}
                />
              ))}
            </div>
            {channel?.description && (
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                {channel.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {connectedPlatforms.length > 0 && (
              <button
                onClick={() => setIsLinkModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-semibold text-[var(--color-ink)] transition flex items-center gap-1.5"
              >
                <span>🔗</span> Link Platform
              </button>
            )}

            <button
              onClick={() => setIsClearModalOpen(true)}
              title="Delete all messages in this channel"
              className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-danger)]/15 hover:text-[var(--color-danger)] text-xs font-medium text-[var(--color-ink-muted)] transition flex items-center gap-1.5 border border-[var(--color-border)] hover:border-[var(--color-danger)]/30"
            >
              <span>🗑️</span> Clear Chat
            </button>
          </div>
        </header>

        {/* Message Stream */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MessageList
            messages={messages}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            onLoadMore={loadMore}
            onEdit={editMessage}
            onDelete={removeMessage}
            onOpenThread={(msg) => setActiveThreadMessage(msg)}
          />
        )}

        {/* Typing Indicator */}
        <TypingIndicator channelId={channelId} />

        {/* Composer */}
        <MessageComposer
          onSend={sendMessage}
          onTyping={() => sendTyping(channelId)}
          placeholder={`Message #${channel?.name || "channel"}`}
        />
      </div>

      {/* Side Thread Panel */}
      {activeThreadMessage && (
        <ThreadPanel
          channelId={channelId}
          parentMessage={activeThreadMessage}
          onClose={() => setActiveThreadMessage(null)}
        />
      )}

      {/* Link Channel Modal */}
      <LinkChannelModal
        channelId={channelId}
        isOpen={isLinkModalOpen}
        connectedPlatforms={connectedPlatforms}
        onClose={() => setIsLinkModalOpen(false)}
        onLinked={() => {
          setIsLinkModalOpen(false);
          loadChannelInfo();
        }}
      />

      {/* Clear Chat Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-danger)]">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-bold text-lg text-[var(--color-ink)]">
                Delete Complete Chat?
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              Are you sure you want to delete all messages in{" "}
              <strong className="text-[var(--color-ink)]">#{channel?.name || "this channel"}</strong>?
              This will remove all message history and thread replies permanently.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isClearing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:bg-[var(--color-border)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                disabled={isClearing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-danger)] text-white hover:opacity-90 transition flex items-center gap-1.5"
              >
                {isClearing ? "Deleting..." : "Yes, Delete Complete Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

