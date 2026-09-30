"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/authentication/useAuth";
import { wsClient } from "@/lib/websocket";

interface RealtimeContextType {
  onlineUsers: Set<string>;
  typingUsersByChannel: Record<string, Record<string, string>>; // channelId -> { userId: userName }
  sendTyping: (channelId: string) => void;
  subscribe: (eventType: string, callback: (event: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsersByChannel, setTypingUsersByChannel] = useState<
    Record<string, Record<string, string>>
  >({});

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("unichat_token") : null;
    if (user && token) {
      wsClient.connect(token);
    } else {
      wsClient.disconnect();
    }
  }, [user]);

  // Handle presence.update and typing events globally
  useEffect(() => {
    const unsubPresence = wsClient.on("presence.update", (evt) => {
      const { user_id, status } = evt.data;
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") {
          next.add(user_id);
        } else {
          next.delete(user_id);
        }
        return next;
      });
    });

    const unsubTyping = wsClient.on("typing", (evt) => {
      const { channel_id, data } = evt;
      const { user_id, user_name } = data;

      // Don't show typing for self
      if (user_id === user?.id) return;

      setTypingUsersByChannel((prev) => {
        const channelTypers = { ...(prev[channel_id] || {}) };
        channelTypers[user_id] = user_name;
        return { ...prev, [channel_id]: channelTypers };
      });

      // Clear typing indicator 3 seconds after last event
      setTimeout(() => {
        setTypingUsersByChannel((prev) => {
          const channelTypers = { ...(prev[channel_id] || {}) };
          delete channelTypers[user_id];
          return { ...prev, [channel_id]: channelTypers };
        });
      }, 3000);
    });

    return () => {
      unsubPresence();
      unsubTyping();
    };
  }, [user]);

  // Throttle sending typing frames to max 1 per 2 seconds
  const [lastTypingSent, setLastTypingSent] = useState<number>(0);
  const sendTyping = useCallback(
    (channelId: string) => {
      const now = Date.now();
      if (now - lastTypingSent >= 2000) {
        setLastTypingSent(now);
        wsClient.send({ type: "typing", channel_id: channelId });
      }
    },
    [lastTypingSent]
  );

  const subscribe = useCallback((eventType: string, callback: (event: any) => void) => {
    return wsClient.on(eventType, callback);
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        onlineUsers,
        typingUsersByChannel,
        sendTyping,
        subscribe,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}
