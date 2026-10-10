"use client";

import React, { useState } from "react";
import { Message } from "../api";
import { useAuth } from "@/features/authentication/useAuth";
import { PlatformBadge } from "@/features/integrations/components/PlatformBadge";

interface MessageItemProps {
  message: Message;
  isCollapsed?: boolean;
  onEdit: (messageId: string, body: string) => Promise<any>;
  onDelete: (messageId: string) => Promise<any>;
  onOpenThread?: (message: Message) => void;
}

export function MessageItem({
  message,
  isCollapsed = false,
  onEdit,
  onDelete,
  onOpenThread,
}: MessageItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(message.body);
  const isOwner = user?.id === message.author.id && message.source === "unichat";

  const handleSaveEdit = async () => {
    if (!editBody.trim()) return;
    try {
      await onEdit(message.id, editBody.trim());
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to edit message", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await onDelete(message.id);
      } catch (err: any) {
        console.error("Failed to delete message", err);
      }
    }
  };

  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isEditing) {
    return (
      <div className="p-3 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] my-1 space-y-2">
        <textarea
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          className="w-full p-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          rows={2}
        />
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 rounded bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 rounded bg-[var(--color-primary)] text-white font-medium"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const isExternal = Boolean(
    message.author?.is_external ||
    (message.source && message.source.toLowerCase() !== "unichat")
  );

  return (
    <div className="group relative flex items-start gap-3 py-1.5 px-3 rounded-xl hover:bg-[var(--color-surface-2)]/60 transition">
      {/* Avatar or time spacer */}
      {!isCollapsed ? (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm"
          style={{
            backgroundColor:
              message.author.avatar_color ||
              (message.source === "slack"
                ? "#4A154B"
                : message.source === "discord"
                ? "#5865F2"
                : "var(--color-primary)"),
          }}
        >
          {message.author.name ? message.author.name[0].toUpperCase() : "U"}
        </div>
      ) : (
        <div className="w-9 text-right text-[10px] text-[var(--color-ink-muted)] opacity-0 group-hover:opacity-100 transition select-none pt-1">
          {formattedTime}
        </div>
      )}

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {!isCollapsed && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-semibold text-sm text-[var(--color-ink)] truncate">
              {message.author.name}
            </span>
            {isExternal && (
              <PlatformBadge platform={message.source} showVia />
            )}
            <span className="text-[10px] text-[var(--color-ink-muted)]">{formattedTime}</span>
          </div>
        )}

        <div
          className={`text-sm text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap break-words ${
            message.is_deleted ? "italic text-[var(--color-ink-muted)]" : ""
          }`}
        >
          {message.body}
          {message.edited_at && !message.is_deleted && (
            <span className="text-[10px] text-[var(--color-ink-muted)] ml-1.5">(edited)</span>
          )}
        </div>

        {/* Thread replies button */}
        {message.reply_count > 0 && onOpenThread && (
          <button
            onClick={() => onOpenThread(message)}
            className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-medium hover:underline"
          >
            <span>💬 {message.reply_count} {message.reply_count === 1 ? "reply" : "replies"}</span>
          </button>
        )}
      </div>

      {/* Action buttons on hover */}
      {!message.is_deleted && (
        <div className="absolute right-2 -top-2 hidden group-hover:flex items-center gap-1 p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md text-xs text-[var(--color-ink-muted)]">
          {onOpenThread && (
            <button
              onClick={() => onOpenThread(message)}
              title="Reply in thread"
              className="p-1 hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] rounded"
            >
              💬
            </button>
          )}
          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                title="Edit message"
                className="p-1 hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] rounded"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                title="Delete message"
                className="p-1 hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-2)] rounded"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
