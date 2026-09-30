"use client";

import React, { useState } from "react";
import { createChannel, Channel } from "../api";

interface CreateChannelModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: (ch: Channel) => void;
}

export function CreateChannelModal({
  workspaceId,
  isOpen,
  onClose,
  onChannelCreated,
}: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const ch = await createChannel(workspaceId, name.trim(), description.trim() || undefined);
      onChannelCreated(ch);
      setName("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
            Create Channel
          </h2>
          <button onClick={onClose} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-lg">
            ✕
          </button>
        </div>

        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
              Channel Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[var(--color-ink-muted)] font-mono">#</span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. announcements"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
              Description (optional)
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              className="w-full px-4 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--color-surface-2)] text-sm font-medium text-[var(--color-ink)] hover:opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-sm font-medium text-white shadow disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
