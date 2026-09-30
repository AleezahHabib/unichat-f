"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getThread, createMessage, updateMessage, deleteMessage, Message, Thread } from "../api";
import { MessageItem } from "./MessageItem";
import { MessageComposer } from "./MessageComposer";

interface ThreadPanelProps {
  channelId: string;
  parentMessage: Message;
  onClose: () => void;
}

export function ThreadPanel({ channelId, parentMessage, onClose }: ThreadPanelProps) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadThread = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getThread(parentMessage.id);
      setThread(data);
    } catch (err: any) {
      console.error("Failed to load thread", err);
    } finally {
      setIsLoading(false);
    }
  }, [parentMessage.id]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  const handleSendReply = async (body: string) => {
    const reply = await createMessage(channelId, body, parentMessage.id);
    setThread((prev) => (prev ? { ...prev, replies: [...prev.replies, reply] } : null));
  };

  const handleEditReply = async (messageId: string, body: string) => {
    const updated = await updateMessage(messageId, body);
    setThread((prev) => {
      if (!prev) return null;
      if (prev.parent.id === messageId) {
        return { ...prev, parent: updated };
      }
      return {
        ...prev,
        replies: prev.replies.map((r) => (r.id === messageId ? updated : r)),
      };
    });
  };

  const handleDeleteReply = async (messageId: string) => {
    const deleted = await deleteMessage(messageId);
    setThread((prev) => {
      if (!prev) return null;
      if (prev.parent.id === messageId) {
        return { ...prev, parent: deleted };
      }
      return {
        ...prev,
        replies: prev.replies.map((r) => (r.id === messageId ? deleted : r)),
      };
    });
  };

  return (
    <div className="w-80 md:w-96 h-full flex flex-col bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-bold text-base text-[var(--color-ink)] font-[var(--font-headline)]">
          Thread
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition"
        >
          ✕
        </button>
      </div>

      {/* Parent message & replies list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread && (
          <>
            <div className="pb-3 border-b border-[var(--color-border)]">
              <MessageItem
                message={thread.parent}
                onEdit={handleEditReply}
                onDelete={handleDeleteReply}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
                {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
              </div>
              {thread.replies.map((reply) => (
                <MessageItem
                  key={reply.id}
                  message={reply}
                  onEdit={handleEditReply}
                  onDelete={handleDeleteReply}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reply input */}
      <MessageComposer onSend={handleSendReply} placeholder="Reply in thread..." />
    </div>
  );
}
