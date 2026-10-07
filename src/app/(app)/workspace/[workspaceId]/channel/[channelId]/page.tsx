"use client";

import React, { useEffect, useState, use } from "react";
import { MessageList } from "@/features/messaging/components/MessageList";
import { MessageComposer } from "@/features/messaging/components/MessageComposer";
import { ThreadPanel } from "@/features/messaging/components/ThreadPanel";
import { useMessages } from "@/features/messaging/useMessages";
import { Message } from "@/features/messaging/api";
import {
  getChannels,
  getChannelMembers,
  joinChannel,
  Channel,
} from "@/features/workspaces-and-channels/api";
import { TypingIndicator } from "@/features/realtime/components/TypingIndicator";
import { useRealtime } from "@/features/realtime/useRealtime";
import { useAuth } from "@/features/authentication/useAuth";
import {
  getIntegrations,
  getWorkspaceChannelLinks,
  ConnectedPlatform,
  ChannelLink,
} from "@/features/integrations/api";
import { LinkChannelModal } from "@/features/integrations/components/LinkChannelModal";
import { PlatformBadge } from "@/features/integrations/components/PlatformBadge";
import { UserPlus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaceId, channelId } = resolvedParams;
  const { user } = useAuth();
  const { sendTyping } = useRealtime();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);
  const [activeThreadMessage, setActiveThreadMessage] = useState<Message | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [isJoining, setIsJoining] = useState(false);

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
    refresh,
  } = useMessages(channelId);

  const handleClearChatForMe = async () => {
    setIsClearing(true);
    try {
      await clearMessages();
      setIsClearModalOpen(false);
    } catch (err: any) {
      console.error("Failed to clear chat for me", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleJoinChannel = async () => {
    setIsJoining(true);
    try {
      await joinChannel(channelId);
      setIsMember(true);
      await loadChannelInfo();
      refresh();
    } catch (err: any) {
      console.error("Failed to join channel", err);
    } finally {
      setIsJoining(false);
    }
  };

  const loadChannelInfo = async () => {
    try {
      const [channels, integrations, links, members] = await Promise.all([
        getChannels(workspaceId),
        getIntegrations(workspaceId),
        getWorkspaceChannelLinks(workspaceId).catch(() => []),
        getChannelMembers(channelId).catch(() => []),
      ]);
      const current = channels.find((c) => c.id === channelId);
      if (current) setChannel(current);
      setConnectedPlatforms(integrations);
      setChannelLinks(links.filter((l) => l.channel_id === channelId));

      const memberMatch = members.some(
        (m) => m.user_id === user?.id || (m as any).id === user?.id
      );
      setIsMember(memberMatch);
    } catch (err: any) {
      console.error("Failed to load channel info", err);
    }
  };

  useEffect(() => {
    loadChannelInfo();
  }, [workspaceId, channelId, user?.id]);

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
            {isMember === false && (
              <button
                onClick={handleJoinChannel}
                disabled={isJoining}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Channel</span>
                  </>
                )}
              </button>
            )}

            {connectedPlatforms.length > 0 && (
              <button
                onClick={() => setIsLinkModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-semibold text-[var(--color-ink)] transition flex items-center gap-1.5 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link Platform</span>
              </button>
            )}

            {isMember && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                title="Clear channel messages for yourself only"
                className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-danger)]/15 hover:text-[var(--color-danger)] text-xs font-medium text-[var(--color-ink-muted)] transition flex items-center gap-1.5 border border-[var(--color-border)] hover:border-[var(--color-danger)]/30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear for me</span>
              </button>
            )}
          </div>
        </header>

        {/* Join Channel Banner (if not member) */}
        {isMember === false && (
          <div className="p-3 bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 px-6 flex items-center justify-between text-xs text-[var(--color-ink)]">
            <span>
              You are viewing <strong>#{channel?.name || "channel"}</strong>. Join this channel to read message history and post messages.
            </span>
            <button
              onClick={handleJoinChannel}
              disabled={isJoining}
              className="px-3 py-1 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              {isJoining ? "Joining..." : "Join"}
            </button>
          </div>
        )}

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
        {isMember === false ? (
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center gap-3 text-xs text-[var(--color-ink-muted)]">
            <span>You must join this channel to send messages.</span>
            <button
              onClick={handleJoinChannel}
              disabled={isJoining}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Join #{channel?.name || "channel"}
            </button>
          </div>
        ) : (
          <MessageComposer
            onSend={sendMessage}
            onTyping={() => sendTyping(channelId)}
            placeholder={`Message #${channel?.name || "channel"}`}
          />
        )}
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

      {/* Clear Chat for Me Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-ink)]">
              <Trash2 className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-lg text-[var(--color-ink)] font-[var(--font-headline)]">
                Clear Chat For You?
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              This will clear your view of the message history in{" "}
              <strong className="text-[var(--color-ink)]">#{channel?.name || "this channel"}</strong>.
              Other members will still see all messages, and no message data will be deleted from the server.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isClearing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:bg-[var(--color-border)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearChatForMe}
                disabled={isClearing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isClearing ? "Clearing..." : "Clear for Me"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
