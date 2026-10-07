"use client";

import { useCallback, useEffect, useState } from "react";
import { wsClient } from "@/lib/websocket";
import {
  getChannelMessages,
  createMessage as apiCreateMessage,
  updateMessage as apiUpdateMessage,
  deleteMessage as apiDeleteMessage,
  clearChannelForMe as apiClearChannelForMe,
  Message,
} from "./api";

export function useMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitial = useCallback(async () => {
    if (!channelId) return;
    setIsLoading(true);
    setError(null);
    try {
      const page = await getChannelMessages(channelId);
      // Messages from API are newest-first, we store them in chronological (oldest-first) for rendering chat
      setMessages([...page.items].reverse());
      setNextCursor(page.next_cursor || null);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Subscribe to WebSocket events live
  useEffect(() => {
    if (!channelId) return;

    const unsubCreated = wsClient.on("message.created", (evt) => {
      if (evt.channel_id === channelId) {
        const newMsg: Message = evt.data;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    const unsubUpdated = wsClient.on("message.updated", (evt) => {
      if (evt.channel_id === channelId) {
        const { id, body, edited_at } = evt.data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, body, edited_at } : msg
          )
        );
      }
    });

    const unsubDeleted = wsClient.on("message.deleted", (evt) => {
      if (evt.channel_id === channelId) {
        const { id } = evt.data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, is_deleted: true, body: "This message was deleted" }
              : msg
          )
        );
      }
    });

    const unsubThread = wsClient.on("thread.reply", (evt) => {
      if (evt.channel_id === channelId) {
        const { parent_id, reply_count, last_reply_at } = evt.data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === parent_id
              ? { ...msg, reply_count, last_reply_at }
              : msg
          )
        );
      }
    });

    return () => {
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
      unsubThread();
    };
  }, [channelId]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const page = await getChannelMessages(channelId, nextCursor);
      const olderMessages = [...page.items].reverse();
      setMessages((prev) => [...olderMessages, ...prev]);
      setNextCursor(page.next_cursor || null);
    } catch (err: any) {
      console.error("Failed to load older messages", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [channelId, nextCursor, isFetchingMore]);

  const sendMessage = useCallback(
    async (body: string, parentId?: string) => {
      const newMsg = await apiCreateMessage(channelId, body, parentId);
      if (!parentId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
      return newMsg;
    },
    [channelId]
  );

  const editMessage = useCallback(async (messageId: string, body: string) => {
    const updated = await apiUpdateMessage(messageId, body);
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? updated : msg))
    );
    return updated;
  }, []);

  const removeMessage = useCallback(async (messageId: string) => {
    const deleted = await apiDeleteMessage(messageId);
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? deleted : msg))
    );
    return deleted;
  }, []);

  const clearMessages = useCallback(async () => {
    await apiClearChannelForMe(channelId);
    setMessages([]);
    setNextCursor(null);
  }, [channelId]);

  return {
    messages,
    isLoading,
    isFetchingMore,
    hasMore: !!nextCursor,
    error,
    loadMore,
    sendMessage,
    editMessage,
    removeMessage,
    clearMessages,
    refresh: fetchInitial,
  };
}
