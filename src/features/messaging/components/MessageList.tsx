"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "../api";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
  onEdit: (messageId: string, body: string) => Promise<any>;
  onDelete: (messageId: string) => Promise<any>;
  onOpenThread?: (message: Message) => void;
}

export function MessageList({
  messages,
  hasMore,
  isFetchingMore,
  onLoadMore,
  onEdit,
  onDelete,
  onOpenThread,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Grouping logic: day headers & author collapse (within 5 minutes)
  const renderMessages = () => {
    let lastDateStr = "";
    let lastAuthorKey: string | null = null;
    let lastTime: number = 0;

    return messages.map((msg) => {
      const msgDate = new Date(msg.created_at);
      const dateStr = msgDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });

      const showDayHeader = dateStr !== lastDateStr;
      if (showDayHeader) {
        lastDateStr = dateStr;
        lastAuthorKey = null;
        lastTime = 0;
      }

      const msgTime = msgDate.getTime();
      const isExternal = Boolean(
        msg.author?.is_external || (msg.source && msg.source.toLowerCase() !== "unichat")
      );
      const currentAuthorKey = msg.author?.id
        ? `user:${msg.author.id}`
        : isExternal
        ? `external:${msg.source}:${msg.author?.name}`
        : null;

      const isCollapsed =
        !showDayHeader &&
        Boolean(currentAuthorKey) &&
        currentAuthorKey === lastAuthorKey &&
        msgTime - lastTime < 5 * 60 * 1000;

      lastAuthorKey = currentAuthorKey;
      lastTime = msgTime;

      return (
        <React.Fragment key={msg.id}>
          {showDayHeader && (
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[var(--color-border)]" />
              <span className="px-3 text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider bg-[var(--color-surface-2)] rounded-full py-0.5">
                {dateStr}
              </span>
              <div className="flex-1 border-t border-[var(--color-border)]" />
            </div>
          )}
          <MessageItem
            message={msg}
            isCollapsed={isCollapsed}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenThread={onOpenThread}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {hasMore && (
        <div className="text-center py-2">
          <button
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="px-4 py-1.5 rounded-full bg-[var(--color-surface-2)] text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition disabled:opacity-50"
          >
            {isFetchingMore ? "Loading..." : "Load older messages"}
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-[var(--color-ink-muted)]">
          No messages yet. Send a message to start the conversation!
        </div>
      ) : (
        renderMessages()
      )}

      <div ref={bottomRef} />
    </div>
  );
}
